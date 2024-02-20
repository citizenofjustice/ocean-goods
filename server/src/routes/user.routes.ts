import { Router } from "express";
import UserController from "../controllers/user.controller";

// Creating a new router
const router = Router();

// Protected routes that require token and roles (middleware used in src/index)
router.post("/register", UserController.createUser);
router.get("", UserController.getUsers);
router.get("/:id", UserController.getOneUser);
router.put("", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
