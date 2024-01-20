import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.authUser);
router.get("", UserController.getUsers);
router.get("/:id", UserController.getOneUser);
router.put("", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
