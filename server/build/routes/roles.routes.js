"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roles_controller_1 = __importDefault(require("../controllers/roles.controller"));
// Creating a new router
const router = (0, express_1.Router)();
// Protected routes that require token and roles (middleware used in src/index)
router.post("/create", roles_controller_1.default.createRole);
router.get("", roles_controller_1.default.getRoles);
router.get("/:id", roles_controller_1.default.getOneRole);
router.get("/select-values", roles_controller_1.default.getRolesSelectValues);
router.put("/:id", roles_controller_1.default.updateRole);
router.delete("/:id", roles_controller_1.default.deleteRole);
exports.default = router;
