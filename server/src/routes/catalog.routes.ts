import { Router } from "express";
import CatalogConroller from "../controllers/catalog.conroller";
import { upload } from "../middleware/multer";
import { verifyToken } from "../middleware/verifyToken";
import { verifyRole } from "../middleware/verifyRole";

const router = Router();

router.post(
  "/create",
  verifyToken,
  verifyRole,
  upload.single("mainImage"),
  CatalogConroller.createCatalogItem
); // Content-type check
router.get("", CatalogConroller.getCatalog);
router.get("/:id", CatalogConroller.getCatalogItem);
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
