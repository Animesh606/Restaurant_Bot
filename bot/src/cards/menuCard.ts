const makeMenuCard = (menu: any) => {
    const card = {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: 1.3,
        body: [
            {
                type: "ColumnSet",
                columns: [
                    {
                        type: "Column",
                        width: 2,
                        items: [
                            {
                                type: "TextBlock",
                                text: menu.name,
                                weight: "bolder",
                                size: "extraLarge",
                                spacing: "none",
                                wrap: true,
                            },
                            {
                                type: "TextBlock",
                                text: `Rs. ${menu.price}/-`,
                                color: "good",
                                weight: "bolder",
                                spacing: "none",
                                wrap: true,
                            },
                            {
                                type: "TextBlock",
                                text: `${menu.description}`,
                                size: "small",
                                wrap: true,
                                maxLines: 3,
                            },
                        ],
                    },
                    {
                        type: "Column",
                        width: 1,
                        items: [
                            {
                                type: "Image",
                                url: `${menu.image_url}`,
                                size: "auto",
                                altText: "",
                            },
                        ],
                    },
                ],
            },
        ],
        actions: [
            {
                type: "Action.ShowCard",
                title: "Give Order",
                card: {
                    version: 1.3,
                    type: "AdaptiveCard",
                    body: [
                        {
                            type: "Input.Text",
                            id: "quantity",
                            placeholder: "0",
                            label: "Enter the quantity: ",
                            width: 0.5
                        },
                    ],
                    actions: [
                        {
                            type: "Action.Submit",
                            title: "Add to Order",
                            data: {
                                title: "Add Order",
                                menu_id: menu.id,
                            },
                        },
                    ],
                },
            },
        ],
    };
    return card;
};

export default makeMenuCard;
