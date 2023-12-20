import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

router.post("/create", UserController.createUser);
router.get("", UserController.getUsers);
router.get("/:id", UserController.getOneUser);
router.put("", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
