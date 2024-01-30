import { Router } from "express";
import OrdersController from "../controllers/orders.controller";
import { verifyRole } from "../middleware/verifyRole";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post(``, OrdersController.createOrder);
router.get(`/all`, verifyToken, verifyRole, OrdersController.getOrders);
router.get(`:id`, verifyToken, verifyRole, OrdersController.getOneOrder);
router.put(``, verifyToken, verifyRole, OrdersController.updateOrder);
router.delete(``, verifyToken, verifyRole, OrdersController.deleteOrder);

export default router;
