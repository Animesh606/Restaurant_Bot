import {
    WaterfallDialog,
    WaterfallStepContext,
    DialogTurnResult,
    TextPrompt,
    ComponentDialog,
} from "botbuilder-dialogs";
import axios from "axios";
import apiConfig from "../api.config";

const RESERVATION_DIALOG = "reservationDialog";
const WATERFALL_DIALOG = "waterfallDialog";
const TEXT_PROMPT = "textPrompt";

export class ReservationDialog extends ComponentDialog {
    constructor() {
        super(RESERVATION_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT)).addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                // this.promptForRestaurantId.bind(this),
                this.promptForReservationDate.bind(this),
                this.promptForSpecialRequests.bind(this),
                this.makeReservation.bind(this),
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }

    private async promptForRestaurantId(
        step: WaterfallStepContext
    ): Promise<DialogTurnResult> {
        return await step.prompt(
            TEXT_PROMPT,
            "Please provide the restaurant ID for your reservation."
        );
    }

    private async promptForReservationDate(
        step: WaterfallStepContext | any
    ): Promise<DialogTurnResult> {
        step.values.restaurantId = step.options.restaurantId;
        return await step.prompt(
            TEXT_PROMPT,
            "Please provide the date and time for your reservation (e.g., 2024-07-13 19:00)."
        );
    }

    private async promptForSpecialRequests(
        step: WaterfallStepContext | any
    ): Promise<DialogTurnResult> {
        step.values.reservationDate = step.result;
        return await step.prompt(
            TEXT_PROMPT,
            "Do you have any special requests for your reservation?"
        );
    }

    private async makeReservation(
        step: WaterfallStepContext | any
    ): Promise<DialogTurnResult> {
        const { restaurantId, reservationDate } = step.values;
        const specialRequests = step.result;

        try {
            const response = await axios.post(`${apiConfig.URL}/reservations`, {
                user_id: 1,
                restaurant_id: restaurantId,
                reservation_date: reservationDate,
                special_requests: specialRequests,
            });

            const reservation = response.data;
            const card = {
                type: "AdaptiveCard",
                body: [
                    {
                        type: "TextBlock",
                        text: "Reservation Confirmed",
                        weight: "bolder",
                        size: "medium",
                        color: "good",
                    },
                    {
                        type: "TextBlock",
                        text: `Restaurant ID: ${reservation.id}`,
                    },
                    {
                        type: "TextBlock",
                        text: `Date and Time: ${reservationDate}`,
                    },
                    {
                        type: "TextBlock",
                        text: `Special Requests: ${specialRequests || "None"}`,
                    },
                ],
                actions: [],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                version: 1.3,
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
                "Sorry, I couldn't make a reservation at this time."
            );
        }

        return await step.endDialog();
    }
}
