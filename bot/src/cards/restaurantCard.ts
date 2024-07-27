const createRestaurantCard = (restaurant: any) => {
    const card = {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.3",
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
                                text: restaurant.name,
                                weight: "bolder",
                                size: "extraLarge",
                                spacing: "none",
                                wrap: true,
                            },
                            {
                                type: "TextBlock",
                                text: restaurant.location,
                                wrap: true,
                                spacing: "None",
                            },
                            {
                                type: "TextBlock",
                                text: restaurant.cuisine,
                                isSubtle: true,
                                spacing: "None",
                                wrap: true,
                            },
                            {
                                type: "TextBlock",
                                text: `${restaurant.rating} - ${restaurant.price_range}`,
                                isSubtle: true,
                                spacing: "None",
                                wrap: true,
                            },
                            {
                                type: "TextBlock",
                                text: restaurant.description,
                                size: "Small",
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
                                url: restaurant.image_url,
                                altText: "",
                            },
                        ],
                    },
                ],
            },
        ],
        actions: [
            {
                type: "Action.Submit",
                title: "Book Reservation",
                data: {
                    restaurantId: restaurant.id,
                    title: "Book Reservation",
                },
            },
            {
                type: "Action.Submit",
                title: "Visit Menu",
                data: {
                    restaurantId: restaurant.id,
                    title: "Visit Menu",
                },
            },
            {
                type: "Action.OpenUrl",
                title: "More Info",
                url: "restaurant.website",
            },
        ],
    };
    return card;
};

export default createRestaurantCard;
