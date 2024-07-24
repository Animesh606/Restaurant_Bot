import { config } from "dotenv";
config();

import * as restify from "restify";
import { INodeSocket } from "botframework-streaming";
import {
    CloudAdapter,
    ConfigurationServiceClientCredentialFactory,
    ConversationState,
    createBotFrameworkAuthenticationFromConfiguration,
    MemoryStorage,
    UserState,
} from "botbuilder";
import { LuisApplication } from "botbuilder-ai";
import { RestaurantBot } from "./bots/restaurantBot";
import { CluRecognizer } from "./cognitiveServices/cluRecognizer";

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId,
});
const botFrameworkAuthentication =
    createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);
const adapter = new CloudAdapter(botFrameworkAuthentication);

const onTurnErrorHandler = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    await context.sendTraceActivity(
        "OnTurnError Trace",
        `${error}`,
        "https://www.botframework.com/schemas/error",
        "TurnError"
    );
    await context.sendActivity("The bot encountered an error or bug.");
    await context.sendActivity(
        "To continue to run this bot, please fix the bot source code."
    );
    await conversationState.delete(context);
};

adapter.onTurnError = onTurnErrorHandler;

let conversationState: ConversationState;
let userState: UserState;

const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);

let luisRecognizer;
const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;
const luisConfig: LuisApplication = {
    applicationId: LuisAppId,
    endpointKey: LuisAPIKey,
    endpoint: `https://${LuisAPIHostName}`,
};

luisRecognizer = new CluRecognizer(luisConfig);

const bot = new RestaurantBot(conversationState, userState);

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log(
        "\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator"
    );
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

server.post("/api/messages", async (req, res) => {
    await adapter.process(req, res, (context) => bot.run(context));
});

server.on("upgrade", async (req, socket, head) => {
    const streamingAdapter = new CloudAdapter(botFrameworkAuthentication);
    streamingAdapter.onTurnError = onTurnErrorHandler;

    await streamingAdapter.process(
        req,
        socket as unknown as INodeSocket,
        head,
        (context) => bot.run(context)
    );
});
