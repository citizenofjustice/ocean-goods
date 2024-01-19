import { Router } from "express";
import RolesController from "../controllers/roles.controller";

const router = Router();

router.post("/create", RolesController.createRole);
router.get("", RolesController.getRoles);
router.get("/:id", RolesController.getOneRole);
router.put("/:id", RolesController.updateRole);
router.delete("/:id", RolesController.deleteRole);

export default router;
