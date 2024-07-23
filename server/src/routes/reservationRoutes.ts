import { Router } from "express";
import { createReservation, deleteReservation, getReservationsByUserId, updateReservation } from "../controllers/reservationController";

const router = Router();

router.post("/", createReservation);
router.get("/user/:userId", getReservationsByUserId);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

export default router;