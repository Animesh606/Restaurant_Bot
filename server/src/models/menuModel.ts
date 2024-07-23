import db from "../config/db";

const Menu = {
    create: async (restaurant_id: Number, data: Object) => {
        const [{ insertId }]: any = await db.query(
            "INSERT INTO menus SET restaurant_id = ?, ?",
            [restaurant_id, data]
        );
        return insertId;
    },
    getByRestaurantId: async (restaurantId: Number) => {
        const [menus] = await db.query(
            "SELECT * FROM menus WHERE restaurant_id = ?",
            [restaurantId]
        );
        return menus;
    },
};

export default Menu;
