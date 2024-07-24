import {
    WaterfallDialog,
    WaterfallStepContext,
    DialogTurnResult,
    TextPrompt,
    ComponentDialog,
} from "botbuilder-dialogs";
import axios from "axios";
import apiConfig from "../api.config";

const RESTAURANT_DIALOG = "restaurantDialog";
const WATERFALL_DIALOG = "waterfallDialog";
const TEXT_PROMPT = "textPrompt";

export class RestaurantDialog extends ComponentDialog {
    constructor() {
        super(RESTAURANT_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.promptForSearchCriteria.bind(this),
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
        const searchCriteria = step.result;

        try {
            const response = await axios.get(
                `${apiConfig.URL}/restaurants/search?criteria=${encodeURIComponent(
                    searchCriteria
                )}`
            );
            const restaurants = response.data;

            if (restaurants.length > 0) {
                const cards = restaurants.map((restaurant: any) => ({
                    type: "Container",
                    items: [
                        {
                            type: "TextBlock",
                            text: restaurant.name,
                            weight: "Bolder",
                            size: "Medium",
                        },
                        { type: "TextBlock", text: restaurant.cuisine },
                        { type: "TextBlock", text: restaurant.location },
                        {
                            type: "TextBlock",
                            text: `$${restaurant.price_range}`,
                            weight: "Bolder",
                            spacing: "Small",
                        },
                        { type: "TextBlock", text: restaurant.description },
                    ],
                }));

                const card = {
                    type: "AdaptiveCard",
                    body: cards,
                    actions: [],
                    $schema:
                        "http://adaptivecards.io/schemas/adaptive-card.json",
                    version: "1.2",
                };

                await step.context.sendActivity({
                    attachments: [
                        {
                            contentType:
                                "application/vnd.microsoft.card.adaptive",
                            content: card,
                        },
                    ],
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
