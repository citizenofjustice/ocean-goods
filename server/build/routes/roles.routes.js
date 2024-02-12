"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roles_controller_1 = __importDefault(require("../controllers/roles.controller"));
const router = (0, express_1.Router)();
router.get("/select-values", roles_controller_1.default.getRolesSelectValues);
router.get("/:id", roles_controller_1.default.getOneRole);
router.put("/:id", roles_controller_1.default.updateRole);
router.delete("/:id", roles_controller_1.default.deleteRole);
router.get("", roles_controller_1.default.getRoles);
router.post("/create", roles_controller_1.default.createRole);
exports.default = router;
