import { Router } from "express";
import { createRestaurant, getRestaurantById, getRestaurants } from "../controllers/restaurantController";
import { addMenu, getMenuByRestaurantId } from "../controllers/menuController";

const router = Router();

router.post("/", createRestaurant);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

router.post("/:restaurantId/menus", addMenu);
router.get("/:restaurantId/menus", getMenuByRestaurantId);

export default router;