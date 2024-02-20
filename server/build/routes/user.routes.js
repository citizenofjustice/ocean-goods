"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
// Creating a new router
const router = (0, express_1.Router)();
// Protected routes that require token and roles (middleware used in src/index)
router.post("/register", user_controller_1.default.createUser);
router.get("", user_controller_1.default.getUsers);
router.get("/:id", user_controller_1.default.getOneUser);
router.put("", user_controller_1.default.updateUser);
router.delete("/:id", user_controller_1.default.deleteUser);
exports.default = router;
