import { Router } from "express";
import UserController from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken";
import { verifyRole } from "../middleware/verifyRole";

const router = Router();

router.get("", UserController.getUsers);
router.get("/:id", UserController.getOneUser);
router.post("/login", UserController.authUser);
router.get("/refresh", UserController.handleRefreshToken);
router.get("/logout", UserController.logoutUser);
router.post("/register", verifyToken, verifyRole, UserController.createUser);
router.put("", verifyToken, verifyRole, UserController.updateUser);
router.delete("/:id", verifyToken, verifyRole, UserController.deleteUser);

export default router;
