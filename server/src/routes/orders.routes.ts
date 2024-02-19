import { Router } from "express";

import { verifyRole } from "../middleware/verifyRole";
import { verifyToken } from "../middleware/verifyToken";
import OrdersController from "../controllers/orders.controller";

// Creating a new router
const router = Router();

// Public route for making an order
router.post(``, OrdersController.createOrder);

// Protected routes that require token and roles
router.get(`/all`, verifyToken, verifyRole, OrdersController.getOrders);
router.get(`/:id`, verifyToken, verifyRole, OrdersController.getOneOrder);
router.put(``, verifyToken, verifyRole, OrdersController.updateOrder);
router.delete(``, verifyToken, verifyRole, OrdersController.deleteOrder);

export default router;
