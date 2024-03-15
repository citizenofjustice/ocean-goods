import { Router } from "express";
import ProductTypesController from "../controllers/productTypes.controller";
import { verifyAccess } from "../middleware/verifyAccess";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// Public route for getting select option values
router.get(
  "/select-values",
  ProductTypesController.getProductTypesSelectValues
);

// Protected routes that require token and priveleges
router.post(
  "/create",
  verifyToken,
  verifyAccess([1, 3]),
  ProductTypesController.createProductType
);
router.get(
  "",
  verifyToken,
  verifyAccess([1, 3]),
  ProductTypesController.getProductTypes
);
router.get(
  "/:id",
  verifyToken,
  verifyAccess([1, 3]),
  ProductTypesController.getOneProductType
);
router.put(
  "/:id",
  verifyToken,
  verifyAccess([1, 3]),
  ProductTypesController.updateProductType
);
router.delete(
  "/:id",
  verifyToken,
  verifyAccess([1, 3]),
  ProductTypesController.deleteProductType
);

export default router;
