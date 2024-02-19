import { Router } from "express";
import ProductTypesController from "../controllers/productTypes.controller";
import { verifyRole } from "../middleware/verifyRole";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// Public route for getting select option values
router.get(
  "/select-values",
  ProductTypesController.getProductTypesSelectValues
);

// Protected routes that require token and roles
router.post(
  "/create",
  verifyToken,
  verifyRole,
  ProductTypesController.createProductType
);
router.get("", verifyToken, verifyRole, ProductTypesController.getProductTypes);
router.get(
  "/:id",
  verifyToken,
  verifyRole,
  ProductTypesController.getOneProductType
);
router.put(
  "/:id",
  verifyToken,
  verifyRole,
  ProductTypesController.updateProductType
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole,
  ProductTypesController.deleteProductType
);

export default router;
