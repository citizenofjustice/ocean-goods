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
      (product_name, product_type_id, in_stock, description, price, discount, weight, kcal, main_image)
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
                // Get the search string and other parameters from the request
                const { filter, orderBy, direction, page = 1, limit = 25 } = req.query;
                // Convert page and limit to numbers
                const pageNum = Number(page);
                const limitNum = Number(limit);
                // Calculate the offset for pagination
                const skip = (pageNum - 1) * limitNum;
                // Define the query parameters
                let queryParameters = {
                    take: limitNum,
                    skip: skip,
                };
                // If a search string is provided, add a WHERE clause to the query
                if (filter) {
                    queryParameters.where = {
                        productName: {
                            contains: filter.toString(),
                            mode: "insensitive",
                        },
                    };
                }
                // Check if orderBy and direction are valid
                const sortByValid = orderBy === "productName" || orderBy === "createdAt";
                const directionValid = direction === "asc" || direction === "desc";
                // Set the orderBy parameter based on the provided orderBy value
                if (sortByValid && directionValid) {
                    switch (orderBy) {
                        case "createdAt":
                            queryParameters.orderBy = {
                                createdAt: direction,
                            };
                            break;
                        case "productName":
                            queryParameters.orderBy = {
                                productName: direction,
                            };
                            break;
                        default:
                            break;
                    }
                }
                // Query the database for items in the catalog
                const catalogQuery = yield db_1.prisma.catalog.findMany(queryParameters);
                // Count the total rows
                const totalRows = yield db_1.prisma.catalog.count();
                // Calculate the cursor for the next page
                const nextPage = totalRows > pageNum * limitNum ? pageNum + 1 : null;
                let catalog;
                // If orderBy is "finalPrice", sort the catalog items by final price
                if (orderBy === "finalPrice" && directionValid) {
                    catalog = sortByFinalPrice(catalogQuery, direction);
                }
                else
                    catalog = catalogQuery;
                // Send the catalog items as the response
                res.status(200).json({ totalRows, catalog, nextPage });
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
                    text: `SELECT catalog.id as "productId", catalog.product_name as "productName", catalog.product_type_id as "productTypeId", catalog.in_stock as "inStock", catalog.description, catalog.price, catalog.discount, catalog.weight, catalog.kcal, catalog.main_image as "mainImage", catalog.created_at as "createdAt", catalog.updated_at as "updatedAt", product_types.type FROM catalog JOIN product_types ON catalog.product_type_id = product_types.id WHERE catalog.id = $1`,
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
          in_stock = $3,
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
/**
 * This function sorts an array of catalog items by their final price.
 * The final price is calculated as the original price minus the discount.
 *
 * @param catalogItems - An array of catalog items to sort.
 * @param direction - The direction to sort the items. Can be "asc" for ascending or "desc" for descending.
 * @throws {Error} Will throw an error if the direction is not "asc" or "desc".
 * @returns An array of catalog items sorted by their final price.
 */
const sortByFinalPrice = (catalogItems, direction) => {
    // Calculate the final price for each item
    const itemsWithFinalPrice = catalogItems.map((item) => (Object.assign(Object.assign({}, item), { finalPrice: item.price - Math.round((item.price * item.discount) / 100) })));
    // Sort the items by the final price in the specified direction
    switch (direction) {
        case "asc":
            itemsWithFinalPrice.sort((a, b) => a.finalPrice - b.finalPrice);
            break;
        case "desc":
            itemsWithFinalPrice.sort((a, b) => b.finalPrice - a.finalPrice);
            break;
        default:
            throw new Error(`Invalid sort direction: ${direction}. Expected "asc" or "desc".`);
    }
    return itemsWithFinalPrice;
};
exports.default = new CatalogController();
