"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyRole_1 = require("../middleware/verifyRole");
const verifyToken_1 = require("../middleware/verifyToken");
const orders_controller_1 = __importDefault(require("../controllers/orders.controller"));
// Creating a new router
const router = (0, express_1.Router)();
// Public route for making an order
router.post(``, orders_controller_1.default.createOrder);
// Protected routes that require token and roles
router.get(`/all`, verifyToken_1.verifyToken, verifyRole_1.verifyRole, orders_controller_1.default.getOrders);
router.get(`/:id`, verifyToken_1.verifyToken, verifyRole_1.verifyRole, orders_controller_1.default.getOneOrder);
router.put(``, verifyToken_1.verifyToken, verifyRole_1.verifyRole, orders_controller_1.default.updateOrder);
router.delete(``, verifyToken_1.verifyToken, verifyRole_1.verifyRole, orders_controller_1.default.deleteOrder);
exports.default = router;
