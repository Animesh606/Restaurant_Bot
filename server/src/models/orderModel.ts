import db from "../config/db";

const Order = {
    create: async (data: any) => {
        const { user_id, restaurant_id, order_date, status, items } = data;
        const [{ insertId }]: any = await db.query(
            "INSERT INTO orders (user_id, restaurant_id, order_date, status, total_amount) VALUES (?, ?, ?, ?, 0);",
            [user_id, restaurant_id, order_date, status]
        );
        const order_id = insertId;
        let total_amount = 0;
        for (let item of items) {
            const [[{ price }]]: any = await db.query(
                "SELECT price FROM menus where id = ?",
                [item.menu_id]
            );
            const prices = price * item.quantity;
            total_amount += prices;
            await db.query(
                "INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)",
                [order_id, item.menu_id, item.quantity, prices]
            );
        }
        await db.query("UPDATE orders SET total_amount = ? WHERE id = ?", [
            total_amount,
            order_id,
        ]);
        return order_id;
    },
    getByUserId: async (userId: Number) => {
        const [orders]: any = await db.query(
            "SELECT * FROM orders WHERE user_id = ?",
            [userId]
        );
        const orderPromises = orders.map(async (order: any) => {
            const [items] = await db.query(
                "SELECT * FROM order_items WHERE order_id = ?",
                [order.id]
            );
            order.items = items;
            return order;
        });
        const detailedOrders = await Promise.all(orderPromises);
        return detailedOrders;
    },
    update: async (id: Number, data: Object) => {
        await db.query("UPDATE orders SET ? WHERE id = ?", [data, id]);
    },
    delete: async (id: Number) => {
        await db.query("DELETE FROM orders WHERE id = ?", [id]);
    },
};

export default Order;
