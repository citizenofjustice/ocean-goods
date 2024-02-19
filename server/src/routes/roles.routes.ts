import { Router } from "express";
import RolesController from "../controllers/roles.controller";

// Creating a new router
const router = Router();

// Protected routes that require token and roles (middleware used in src/index)
router.post("/create", RolesController.createRole);
router.get("", RolesController.getRoles);
router.get("/:id", RolesController.getOneRole);
router.get("/select-values", RolesController.getRolesSelectValues);
router.put("/:id", RolesController.updateRole);
router.delete("/:id", RolesController.deleteRole);

export default router;
