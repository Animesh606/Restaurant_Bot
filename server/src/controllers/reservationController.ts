import { NextFunction, Request, Response } from "express";
import Reservation from "../models/reservationModel";

const createReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body;
        const id = await Reservation.create(data);
        res.status(201).send({
            message: "Reservation created successfully!",
            id,
        });
    } catch (error) {
        next(error);
    }
};

const getReservationsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = Number(req.params.userId);
        const reservations = await Reservation.getByUserId(userId);
        res.status(200).send(reservations);
    } catch (error) {
        next(error);
    }
};

const updateReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;
        await Reservation.update(id, data);
        res.status(200).send({
            message: "Reservation updated successfully!",
        });
    } catch (error) {
        next(error);
    }
};

const deleteReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);
        await Reservation.delete(id);
        res.status(200).send({
            message: "Reservation deleted Successfully",
        });
    } catch (error) {
        next(error);
    }
};

export {
    createReservation,
    getReservationsByUserId,
    updateReservation,
    deleteReservation,
};
