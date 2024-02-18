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
// String to convert column names to camelCase
const catalogCamelCase = `id as "productId", product_name as "productName", product_type_id as "productTypeId", in_stoke as "inStock", description, price, discount, weight, kcal, main_image as "mainImage", created_at as "createdAt", updated_at as "updatedAt"`;
class CatalogController {
    // method for creating a new catalogItem
    createCatalogItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the item details from the request body
                const item = yield req.body;
                let imageLink = "";
                // If there is a file in the request, upload it and get the URL
                if (req.file)
                    imageLink = yield (0, upload_1.uploadPictureAndGetUrl)(req.file);
                // Insert the new item into the database
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
                // Send the newly created item as the response
                res.status(201).json(newItem.rows[0]);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method to get the entire catalog
    getCatalog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database for all items in the catalog
                const catalog = yield (0, db_1.dbQuery)({
                    text: `SELECT ${catalogCamelCase} FROM catalog ORDER BY updated_at DESC`,
                });
                // Send the catalog items as the response
                res.status(200).json(catalog.rows);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method for retrieving a specific catalogItem
    getCatalogItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the item ID from the request parameters
                const id = req.params.id;
                // Query the database for the specific item
                const catalogItem = yield (0, db_1.dbQuery)({
                    text: `SELECT catalog.id as "productId", catalog.product_name as "productName", catalog.product_type_id as "productTypeId", catalog.in_stoke as "inStock", catalog.description, catalog.price, catalog.discount, catalog.weight, catalog.kcal, catalog.main_image as "mainImage", catalog.created_at as "createdAt", catalog.updated_at as "updatedAt", product_types.type FROM catalog JOIN product_types ON catalog.product_type_id = product_types.id WHERE catalog.id = $1`,
                    values: [id],
                });
                // Send the catalog item as the response
                res.status(200).json(catalogItem.rows[0]);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method for Updating a catalogItem
    updateCatalogItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the item ID from the request parameters
                const id = req.params.id;
                // Get the updated item details from the request body
                const item = yield req.body;
                let imageLink = "";
                // If there is a file in the request, upload it and get the URL
                if (req.file) {
                    imageLink = yield (0, upload_1.uploadPictureAndGetUrl)(req.file);
                }
                else {
                    imageLink = item.mainImage;
                }
                // Update the item in the database
                yield (0, db_1.dbQuery)({
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
                // Send a success status
                res.sendStatus(204);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method for deleting a catalogItem
    deleteCatalogItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the item ID from the request parameters
                const id = req.params.id;
                // Delete the item from the database
                yield (0, db_1.dbQuery)({
                    text: `DELETE FROM catalog WHERE id = $1`,
                    values: [id],
                });
                // Send a success status
                res.sendStatus(204);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
}
exports.default = new CatalogController();
