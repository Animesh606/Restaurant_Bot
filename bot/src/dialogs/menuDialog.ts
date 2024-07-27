import {
    WaterfallDialog,
    WaterfallStepContext,
    DialogTurnResult,
    TextPrompt,
    ComponentDialog,
} from "botbuilder-dialogs";
import axios from "axios";
import apiConfig from "../api.config";
import makeMenuCard from "../cards/menuCard";
import { MessageFactory } from "botbuilder";

const MENU_DIALOG = "menuDialog";
const WATERFALL_DIALOG = "waterfallDialog";
const TEXT_PROMPT = "textPrompt";

export class MenuDialog extends ComponentDialog {
    constructor() {
        super(MENU_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT)).addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                // this.promptForRestaurantId.bind(this),
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
        step: WaterfallStepContext | any
    ): Promise<DialogTurnResult> {
        const { restaurantId } = step.options;
        console.log("restaurantId", restaurantId);
        try {
            const response = await axios.get(
                `${apiConfig.URL}/restaurants/${restaurantId}/menus`
            );
            const menus = response.data;

            const attachments = menus.map((menu: any) => {
                const card = makeMenuCard(menu);
                const attachment = {
                    contentType: "application/vnd.microsoft.card.adaptive",
                    content: card,
                };
                return attachment;
            });

            if(attachments && attachments.length > 0) {
                await step.context.sendActivity(
                    "Here are the menu items of the choosen restaurant."
                );
                
                await step.context.sendActivity({
                    attachments,
                });
            }
            else {
                await step.context.sendActivity(
                    "Sorry, I couldn't find any menus for this restaurant."
                );
            }
        } catch (error) {
            await step.context.sendActivity(
                "Sorry, I couldn't find any menus for this restaurant."
            );
        }
        return await step.endDialog();
    }
}
