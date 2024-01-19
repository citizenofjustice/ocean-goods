import { Router } from "express";
import CatalogConroller from "../controllers/catalog.conroller";
import { upload } from "../middleware/multer";

const router = Router();

router.post(
  "/create",
  upload.single("mainImage"),
  CatalogConroller.createCatalogItem
);
router.get("", CatalogConroller.getCatalog);
router.get("/:id", CatalogConroller.getCatalogItem);
router.put(
  "/:id",
  upload.single("mainImage"),
  CatalogConroller.updateCatalogItem
);
router.delete("/:id", CatalogConroller.deleteCatalogItem);

export default router;
