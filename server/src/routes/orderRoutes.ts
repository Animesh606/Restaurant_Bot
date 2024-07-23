import { Router } from "express";
import {
    createOrder,
    deleteOrder,
    getOrdersByUserId,
    updateOrder,
} from "../controllers/orderController";

const router = Router();

router.post("/", createOrder);
router.get("/user/:userId", getOrdersByUserId);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
