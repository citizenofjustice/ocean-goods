import { Router } from "express";
import RolesController from "../controllers/roles.controller";

const router = Router();

router.get("/select-values", RolesController.getRolesSelectValues);
router.get("/:id", RolesController.getOneRole);
router.put("/:id", RolesController.updateRole);
router.delete("/:id", RolesController.deleteRole);
router.get("", RolesController.getRoles);
router.post("/create", RolesController.createRole);

export default router;
