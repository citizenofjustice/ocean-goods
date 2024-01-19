import { Router } from "express";
import PrivelegesController from "../controllers/priveleges.controller";

const router = Router();

router.post("/create", PrivelegesController.createPrivelege);
router.get("", PrivelegesController.getPriveleges);
router.get("/:id", PrivelegesController.getOnePrivelege);
router.put("/:id", PrivelegesController.updatePrivelege);
router.delete("/:id", PrivelegesController.deletePrivelege);

export default router;
