import { Router } from "express";

import { verifyAccess } from "../middleware/verifyAccess";
import { verifyToken } from "../middleware/verifyToken";
import OrdersController from "../controllers/orders.controller";

// Creating a new router
const router = Router();

// Public route for making an order
router.post(``, OrdersController.createOrder);

// Protected routes that require token and priveleges
router.get(
  `/all`,
  verifyToken,
  verifyAccess([1, 5]),
  OrdersController.getOrders
);
router.get(
  `/:id`,
  verifyToken,
  verifyAccess([1, 5]),
  OrdersController.getOneOrder
);
router.put(``, verifyToken, verifyAccess([1, 5]), OrdersController.updateOrder);
router.delete(
  ``,
  verifyToken,
  verifyAccess([1, 5]),
  OrdersController.deleteOrder
);

export default router;
