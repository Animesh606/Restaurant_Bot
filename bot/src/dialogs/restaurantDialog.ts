import {
    WaterfallDialog,
    WaterfallStepContext,
    DialogTurnResult,
    TextPrompt,
    ComponentDialog,
} from "botbuilder-dialogs";
import axios from "axios";
import apiConfig from "../api.config";
import { MessageFactory } from "botbuilder";
import createRestaurantCard from "../cards/restaurantCard";

const RESTAURANT_DIALOG = "restaurantDialog";
const WATERFALL_DIALOG = "waterfallDialog";
const TEXT_PROMPT = "textPrompt";

export class RestaurantDialog extends ComponentDialog {
    constructor() {
        super(RESTAURANT_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT)).addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                // this.promptForSearchCriteria.bind(this),
                this.displayRestaurants.bind(this),
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }

    private async promptForSearchCriteria(
        step: WaterfallStepContext
    ): Promise<DialogTurnResult> {
        return await step.prompt(
            TEXT_PROMPT,
            "Please provide the search criteria (e.g., cuisine type, location, price range, or specific keywords)."
        );
    }

    private async displayRestaurants(
        step: WaterfallStepContext
    ): Promise<DialogTurnResult> {
        // const searchCriteria = step.result;

        try {
            const response = await axios.get(`${apiConfig.URL}/restaurants/`);
            const restaurants = response.data;

            if (restaurants.length > 0) {
                const attachments = await restaurants.map((restaurant: any) => {
                    const card = createRestaurantCard(restaurant);
                    const attachment = {
                        contentType: "application/vnd.microsoft.card.adaptive",
                        content: card,
                    };
                    return attachment;
                });

                await step.context.sendActivity(MessageFactory.text("Here we got some matching restaurants.."));

                await step.context.sendActivity({
                    attachments,
                });
            } else {
                await step.context.sendActivity(
                    "Sorry, no restaurants matched your search criteria."
                );
            }
        } catch (error) {
            await step.context.sendActivity(
                "Sorry, there was an error retrieving the restaurants."
            );
        }

        return await step.endDialog();
    }
}
