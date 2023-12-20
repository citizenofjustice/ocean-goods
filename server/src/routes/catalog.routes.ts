import { Router } from "express";
import CatalogConroller from "../controllers/catalog.conroller";

const router = Router();

router.post("/create", CatalogConroller.createCatalogItem);
router.get("", CatalogConroller.getCatalog);
router.get("/:id", CatalogConroller.getCatalogItem);
router.put("", CatalogConroller.updateCatalogItem);
router.delete("/:id", CatalogConroller.deleteCatalogItem);

export default router;
