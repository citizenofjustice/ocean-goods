"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const upload_1 = require("../upload");
const catalogCamelCase = `id as "productId", product_name as "productName", product_type_id as "productTypeId", in_stoke as "inStock", description, price, discount, weight, kcal, main_image as "mainImage", created_at as "createdAt", updated_at as "updatedAt"`;
class CatalogController {
    createCatalogItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield req.body;
            let imageLink = "";
            if (req.file)
                imageLink = yield (0, upload_1.uploadPictureAndGetUrl)(req.file);
            const newItem = yield (0, db_1.dbQuery)({
                text: `INSERT INTO catalog
      (product_name, product_type_id, in_stoke, description, price, discount, weight, kcal, main_image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  RETURNING *`,
                values: [
                    item.productName,
                    item.productTypeId,
                    item.inStock ? true : false,
                    item.description,
                    item.price,
                    item.discount,
                    item.weight,
                    item.kcal,
                    imageLink,
                ],
            });
            res.json(newItem.rows[0]);
        });
    }
    getCatalog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const catalog = yield (0, db_1.dbQuery)({
                text: `SELECT ${catalogCamelCase} FROM catalog ORDER BY updated_at DESC`,
            });
            res.json(catalog.rows);
        });
    }
    getCatalogItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const catalogItem = yield (0, db_1.dbQuery)({
                text: `SELECT catalog.id as "productId", catalog.product_name as "productName", catalog.product_type_id as "productTypeId", catalog.in_stoke as "inStock", catalog.description, catalog.price, catalog.discount, catalog.weight, catalog.kcal, catalog.main_image as "mainImage", catalog.created_at as "createdAt", catalog.updated_at as "updatedAt", product_types.type FROM catalog JOIN product_types ON catalog.product_type_id = product_types.id WHERE catalog.id = $1`,
                values: [id],
            });
            res.json(catalogItem.rows[0]);
        });
    }
    updateCatalogItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const item = yield req.body;
            let imageLink = "";
            if (req.file) {
                imageLink = yield (0, upload_1.uploadPictureAndGetUrl)(req.file);
            }
            else {
                imageLink = item.mainImage;
            }
            const updatedItem = yield (0, db_1.dbQuery)({
                text: `UPDATE catalog SET 
        product_name = $1,
        product_type_id = $2,
        in_stoke = $3,
        description = $4,
        price = $5,
        discount = $6,
        weight = $7,
        kcal = $8,
        main_image = $9,
        updated_at = NOW()
        WHERE id = $10 RETURNING *`,
                values: [
                    item.productName,
                    item.productTypeId,
                    item.inStock,
                    item.description,
                    item.price,
                    item.discount,
                    item.weight,
                    item.kcal,
                    imageLink,
                    id,
                ],
            });
            res.json(updatedItem.rows[0]);
        });
    }
    deleteCatalogItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const catalogItem = yield (0, db_1.dbQuery)({
                text: `DELETE FROM catalog WHERE id = $1`,
                values: [id],
            });
            res.json(catalogItem.rows[0]);
        });
    }
}
exports.default = new CatalogController();
