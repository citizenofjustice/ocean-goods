"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
// Creating a new router
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.default.authUser);
router.get("/refresh", auth_controller_1.default.handleRefreshToken);
router.get("/logout", auth_controller_1.default.logoutUser);
exports.default = router;
