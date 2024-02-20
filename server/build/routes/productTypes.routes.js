"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productTypes_controller_1 = __importDefault(require("../controllers/productTypes.controller"));
const verifyRole_1 = require("../middleware/verifyRole");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
// Public route for getting select option values
router.get("/select-values", productTypes_controller_1.default.getProductTypesSelectValues);
// Protected routes that require token and roles
router.post("/create", verifyToken_1.verifyToken, verifyRole_1.verifyRole, productTypes_controller_1.default.createProductType);
router.get("", verifyToken_1.verifyToken, verifyRole_1.verifyRole, productTypes_controller_1.default.getProductTypes);
router.get("/:id", verifyToken_1.verifyToken, verifyRole_1.verifyRole, productTypes_controller_1.default.getOneProductType);
router.put("/:id", verifyToken_1.verifyToken, verifyRole_1.verifyRole, productTypes_controller_1.default.updateProductType);
router.delete("/:id", verifyToken_1.verifyToken, verifyRole_1.verifyRole, productTypes_controller_1.default.deleteProductType);
exports.default = router;
