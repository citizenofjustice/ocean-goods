import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/login", AuthController.authUser);
router.get("/refresh", AuthController.handleRefreshToken);
router.get("/logout", AuthController.logoutUser);

export default router;
