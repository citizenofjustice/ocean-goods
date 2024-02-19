import { Router } from "express";
import PrivelegesController from "../controllers/priveleges.controller";

// Creating a new router
const router = Router();

// Protected routes that require token and roles (middleware used in src/index)
router.post("/create", PrivelegesController.createPrivelege);
router.get("", PrivelegesController.getPriveleges);
router.get("/:id", PrivelegesController.getOnePrivelege);
router.put("/:id", PrivelegesController.updatePrivelege);
router.delete("/:id", PrivelegesController.deletePrivelege);

export default router;
