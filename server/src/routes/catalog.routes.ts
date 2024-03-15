import { Router } from "express";

import { upload } from "../middleware/multer";
import { verifyToken } from "../middleware/verifyToken";
import { verifyAccess } from "../middleware/verifyAccess";
import CatalogConroller from "../controllers/catalog.conroller";

// Creating a new router
const router = Router();

// Public routes for getting catalog data
router.get("", CatalogConroller.getCatalog);
router.get("/:id", CatalogConroller.getCatalogItem);

// Protected routes that require token and priveleges
router.post(
  "/create",
  verifyToken,
  verifyAccess([1, 3]),
  upload.single("mainImage"),
  CatalogConroller.createCatalogItem
);
router.put(
  "/:id",
  verifyToken,
  verifyAccess([1, 3]),
  upload.single("mainImage"),
  CatalogConroller.updateCatalogItem
);
router.delete(
  "/:id",
  verifyToken,
  verifyAccess([1, 3]),
  CatalogConroller.deleteCatalogItem
);

export default router;
