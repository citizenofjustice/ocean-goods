"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../middleware/multer");
const verifyToken_1 = require("../middleware/verifyToken");
const verifyRole_1 = require("../middleware/verifyRole");
const catalog_conroller_1 = __importDefault(require("../controllers/catalog.conroller"));
// Creating a new router
const router = (0, express_1.Router)();
// Public routes for getting catalog data
router.get("", catalog_conroller_1.default.getCatalog);
router.get("/:id", catalog_conroller_1.default.getCatalogItem);
// Protected routes that require token and roles
router.post("/create", verifyToken_1.verifyToken, verifyRole_1.verifyRole, multer_1.upload.single("mainImage"), catalog_conroller_1.default.createCatalogItem); // Content-type check
router.put("/:id", verifyToken_1.verifyToken, verifyRole_1.verifyRole, multer_1.upload.single("mainImage"), catalog_conroller_1.default.updateCatalogItem); // Content-type check
router.delete("/:id", verifyToken_1.verifyToken, verifyRole_1.verifyRole, catalog_conroller_1.default.deleteCatalogItem);
exports.default = router;
