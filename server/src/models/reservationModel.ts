import db from "../config/db";

const Reservation = {
    create: async (data: Object) => {
        const [{ insertId }]: any = await db.query(
            "INSERT INTO reservations SET ?",
            [data]
        );
        return insertId;
    },
    getByUserId: async (userId: Number) => {
        const [reservations] = await db.query(
            "SELECT * FROM reservations WHERE user_id = ?",
            [userId]
        );
        return reservations;
    },
    update: async (id: Number, data: Object) => {
        await db.query("UPDATE reservations SET ? WHERE id = ?", [data, id]);
    },
    delete: async (id: Number) => {
        await db.query("DELETE FROM reservations WHERE id = ?", [id]);
    },
};

export default Reservation;
