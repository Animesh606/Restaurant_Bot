import { NextFunction, Request, Response } from "express";
import Order from "../models/orderModel";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const order_id = await Order.create(data);
        res.status(201).send({
            message: "Order created successfully",
            id: order_id,
        });
    } catch (error) {
        next(error);
    }
};

const getOrdersByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = Number(req.params.userId);
        const orders = await Order.getByUserId(userId);
        res.status(200).send(orders);
    } catch (error) {
        next(error);
    }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const data = req.body;
        await Order.update(Number(id), data);
        res.status(200).send({ message: "Order updated successfully" });
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        await Order.delete(Number(id));
        res.status(200).send({ message: "Order deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export { createOrder, getOrdersByUserId, updateOrder, deleteOrder };
