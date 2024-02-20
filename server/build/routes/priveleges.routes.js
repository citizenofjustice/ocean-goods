"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const priveleges_controller_1 = __importDefault(require("../controllers/priveleges.controller"));
// Creating a new router
const router = (0, express_1.Router)();
// Protected routes that require token and roles (middleware used in src/index)
router.post("/create", priveleges_controller_1.default.createPrivelege);
router.get("", priveleges_controller_1.default.getPriveleges);
router.get("/:id", priveleges_controller_1.default.getOnePrivelege);
router.put("/:id", priveleges_controller_1.default.updatePrivelege);
router.delete("/:id", priveleges_controller_1.default.deletePrivelege);
exports.default = router;
