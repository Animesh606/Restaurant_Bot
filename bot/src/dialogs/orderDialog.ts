import {
    WaterfallDialog,
    WaterfallStepContext,
    DialogTurnResult,
    TextPrompt,
    ComponentDialog,
} from "botbuilder-dialogs";
import axios from "axios";
import apiConfig from "../api.config";

const ORDER_DIALOG = "orderDialog";
const WATERFALL_DIALOG = "waterfallDialog";
const TEXT_PROMPT = "textPrompt";

export class OrderDialog extends ComponentDialog {
    constructor() {
        super(ORDER_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.promptForRestaurantId.bind(this),
                this.promptForOrderItems.bind(this),
                this.placeOrder.bind(this),
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }

    private async promptForRestaurantId(
        step: WaterfallStepContext
    ): Promise<DialogTurnResult> {
        return await step.prompt(
            TEXT_PROMPT,
            "Please provide the restaurant ID to place an order."
        );
    }

    private async promptForOrderItems(
        step: WaterfallStepContext | any
    ): Promise<DialogTurnResult> {
        step.values.restaurantId = step.result;
        return await step.prompt(
            TEXT_PROMPT,
            'Please list the menu items you would like to order (e.g., {"menu_id": 1, "quantity": 2}).'
        );
    }

    private async placeOrder(
        step: WaterfallStepContext | any
    ): Promise<DialogTurnResult> {
        const { restaurantId } = step.values;
        const items = JSON.parse(step.result);
        const userId = 1; // Replace with actual user ID from context
        const orderDate = new Date().toISOString();

        try {
            const response = await axios.post(
                `${apiConfig.URL}/orders`,
                {
                    user_id: userId,
                    restaurant_id: restaurantId,
                    order_date: orderDate,
                    status: "Pending",
                    items,
                }
            );

            const order = response.data;
            const card = {
                type: "AdaptiveCard",
                body: [
                    {
                        type: "TextBlock",
                        text: "Order Placed Successfully",
                        weight: "Bolder",
                        size: "Medium",
                    },
                    { type: "TextBlock", text: `Order ID: ${order.id}` },
                    {
                        type: "TextBlock",
                        text: `Restaurant ID: ${order.restaurant_id}`,
                    },
                    {
                        type: "TextBlock",
                        text: `Total Amount: $${order.total_amount.toFixed(2)}`,
                    },
                    { type: "TextBlock", text: `Status: ${order.status}` },
                ],
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
                "Sorry, I couldn't place your order at this time."
            );
        }

        return await step.endDialog();
    }
}
