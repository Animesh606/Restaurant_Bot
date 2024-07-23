import db from "../config/db";

const Restaurant = {
    create: async (data: Object) => {
        const [{ insertId }]: any = await db.query(
            `INSERT INTO restaurants SET ?`,
            [data]
        );
        return insertId;
    },
    getAll: async () => {
        const [restaurants] = await db.query("SELECT * FROM restaurants");
        return restaurants;
    },
    getById: async (id: Number) => {
        const [[restaurant]]: any = await db.query(
            "SELECT * FROM restaurants WHERE id = ?",
            [id]
        );
        return restaurant;
    },
};
export default Restaurant;
