import {
    ActivityHandler,
    BotState,
    ConversationState,
    StatePropertyAccessor,
    UserState,
    MessageFactory,
    TurnContext,
} from "botbuilder";
import { DialogState, DialogSet, DialogTurnStatus } from "botbuilder-dialogs";
import { MenuDialog } from "../dialogs/menuDialog";
import { OrderDialog } from "../dialogs/orderDialog";
import { ReservationDialog } from "../dialogs/reservationDialog";
import { RootDialog } from "../dialogs/rootDialog";
import { RestaurantDialog } from "../dialogs/restaurantDialog";

const DIALOG_STATE_PROPERTY = "dialogState";

export class RestaurantBot extends ActivityHandler {
    private conversationState: BotState;
    private userState: BotState;
    private dialogs: DialogSet;
    private dialogState: StatePropertyAccessor<DialogState> | any;

    constructor(conversationState, userState) {
        super();

        if (!conversationState)
            throw new Error(
                "[RestaurantBot]: Missing parameter. conversationState is required"
            );
        if (!userState)
            throw new Error(
                "[RestaurantBot]: Missing parameter. userState is required"
            );

        this.dialogState = conversationState.createProperty(
            DIALOG_STATE_PROPERTY
        );
        this.dialogs = new DialogSet(this.dialogState);
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialogs.add(new RootDialog());
        this.dialogs.add(new MenuDialog());
        this.dialogs.add(new OrderDialog());
        this.dialogs.add(new ReservationDialog());
        this.dialogs.add(new RestaurantDialog());

        this.onMessage(async (context, next) => {
            console.log("context", context.activity.value);
            const dialogContext = await this.dialogs.createContext(context);
            const result = await dialogContext.continueDialog();

            if (context.activity.value) {
                switch (context.activity.value.title) {
                    case "Visit Menu":
                        await dialogContext.beginDialog("menuDialog", {
                            restaurantId: context.activity.value.restaurantId,
                        });
                        break;
                    case "Book Reservation":
                        await dialogContext.beginDialog("reservationDialog", {
                            restaurantId: context.activity.value.restaurantId,
                        });
                        break;
                }
            } else if (result.status === DialogTurnStatus.empty) {
                await dialogContext.beginDialog("rootDialog");
            }

            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const welcomeMessage =
                "Welcome to the Restaurant Bot! How can I assist you today?";
            await context.sendActivity(
                MessageFactory.text(welcomeMessage, welcomeMessage)
            );
            await next();
        });
    }
    async run(context: TurnContext) {
        await super.run(context);

        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}
