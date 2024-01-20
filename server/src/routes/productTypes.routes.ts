import { Router } from "express";
import ProductTypesController from "../controllers/productTypes.controller";

const router = Router();

router.post("/create", ProductTypesController.createProductType);
router.get("", ProductTypesController.getProductTypes);
router.get(
  "/select-values",
  ProductTypesController.getProductTypesSelectValues
);
router.get("/:id", ProductTypesController.getOneProductType);
router.put("/:id", ProductTypesController.updateProductType);
router.delete("/:id", ProductTypesController.deleteProductType);

export default router;
