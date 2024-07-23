import { Router } from "express";
import RestaurantRoutes from "./restaurantRoutes";
import ReservationRoutes from "./reservationRoutes";
import OrderRoutes from "./orderRoutes";

const router = Router();

router.use("/restaurants", RestaurantRoutes);
router.use("/reservations", ReservationRoutes);
router.use("/orders", OrderRoutes);

export default router;