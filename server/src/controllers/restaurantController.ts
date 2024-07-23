import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurantModel";

const createRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body;
        const id = await Restaurant.create(data);
        res.status(201).send({
            message: "Restaurant created successfully!",
            id,
        });
    } catch (error) {
        next(error);
    }
};
const getRestaurants = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const restaurants = await Restaurant.getAll();
        res.status(200).send(restaurants);
    } catch (error) {
        next(error);
    }
};

const getRestaurantById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);
        const restaurant = await Restaurant.getById(id);
        res.status(200).send(restaurant);
    } catch (error) {
        next(error);
    }
};

export { createRestaurant, getRestaurants, getRestaurantById };
