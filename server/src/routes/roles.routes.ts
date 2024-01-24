import { Router } from "express";
import RolesController from "../controllers/roles.controller";
import { verifyRole } from "../middleware/verifyRole";

const router = Router();

router.get("/select-values", RolesController.getRolesSelectValues);
router.get("/:id", RolesController.getOneRole);
router.put("/:id", RolesController.updateRole);
router.delete("/:id", RolesController.deleteRole);
router.get("", verifyRole, RolesController.getRoles);
router.post("/create", verifyRole, RolesController.createRole);

export default router;
