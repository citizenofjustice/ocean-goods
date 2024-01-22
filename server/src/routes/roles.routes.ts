import { Router } from "express";
import RolesController from "../controllers/roles.controller";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/create", RolesController.createRole);
router.get("", RolesController.getRoles);
router.get("/select-values", RolesController.getRolesSelectValues);
router.get("/:id", RolesController.getOneRole);
router.put("/:id", verifyToken, RolesController.updateRole);
router.delete("/:id", RolesController.deleteRole);

export default router;
