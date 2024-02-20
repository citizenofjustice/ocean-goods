import { Router } from "express";

import { upload } from "../middleware/multer";
import { verifyToken } from "../middleware/verifyToken";
import { verifyRole } from "../middleware/verifyRole";
import CatalogConroller from "../controllers/catalog.conroller";

// Creating a new router
const router = Router();

// Public routes for getting catalog data
router.get("", CatalogConroller.getCatalog);
router.get("/:id", CatalogConroller.getCatalogItem);

// Protected routes that require token and roles
router.post(
  "/create",
  verifyToken,
  verifyRole,
  upload.single("mainImage"),
  CatalogConroller.createCatalogItem
); // Content-type check
router.put(
  "/:id",
  verifyToken,
  verifyRole,
  upload.single("mainImage"),
  CatalogConroller.updateCatalogItem
); // Content-type check
router.delete(
  "/:id",
  verifyToken,
  verifyRole,
  CatalogConroller.deleteCatalogItem
);

export default router;
