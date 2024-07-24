import {
    WaterfallDialog,
    WaterfallStepContext,
    DialogTurnResult,
    TextPrompt,
    ComponentDialog,
} from "botbuilder-dialogs";
import axios from "axios";
import apiConfig from "../api.config";

const MENU_DIALOG = "menuDialog";
const WATERFALL_DIALOG = "waterfallDialog";
const TEXT_PROMPT = "textPrompt";

export class MenuDialog extends ComponentDialog {
    constructor() {
        super(MENU_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.promptForRestaurantId.bind(this),
                this.displayMenu.bind(this),
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }

    private async promptForRestaurantId(
        step: WaterfallStepContext
    ): Promise<DialogTurnResult> {
        return await step.prompt(
            TEXT_PROMPT,
            "Please provide the restaurant ID to explore the menu."
        );
    }

    private async displayMenu(
        step: WaterfallStepContext
    ): Promise<DialogTurnResult> {
        const restaurantId = step.result;
        try {
            const response = await axios.get(
                `${apiConfig.URL}/restaurants/${restaurantId}/menus`
            );
            const menus = response.data;

            const card = {
                type: "AdaptiveCard",
                body: menus.map((item) => ({
                    type: "Container",
                    items: [
                        {
                            type: "TextBlock",
                            text: item.name,
                            weight: "Bolder",
                            size: "Medium",
                        },
                        { type: "TextBlock", text: item.description },
                        {
                            type: "TextBlock",
                            text: `$${item.price.toFixed(2)}`,
                            weight: "Bolder",
                            spacing: "Small",
                        },
                    ],
                })),
                actions: [],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                version: "1.2",
            };

            await step.context.sendActivity({
                attachments: [
                    {
                        contentType: "application/vnd.microsoft.card.adaptive",
                        content: card,
                    },
                ],
            });
        } catch (error) {
            await step.context.sendActivity(
                "Sorry, I couldn't find any menus for this restaurant."
            );
        }
        return await step.endDialog();
    }
}
