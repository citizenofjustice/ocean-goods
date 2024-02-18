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
// Defining the product types in camel case for SQL queries
const productTypesCamelCase = `id as "productTypeId", type, created_at as "createdAt", updated_at as "updatedAt"`;
class ProductTypesController {
    // Method to create a new product type
    createProductType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type } = req.body;
                // checking if type is a string
                if (typeof type !== "string")
                    throw new Error("Неверный тип данных");
                //  inserting new product to database
                const newProductType = yield (0, db_1.dbQuery)({
                    text: `INSERT INTO product_types (type) VALUES ($1) RETURNING *`,
                    values: [type],
                });
                res.status(201).json(newProductType.rows[0]); // Sending the newly created product type as a response
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // Method to get all product types
    getProductTypes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetching all product types from the database
                const productTypes = yield (0, db_1.dbQuery)({
                    text: `SELECT ${productTypesCamelCase} FROM product_types ORDER BY updated_at DESC`,
                });
                res.status(200).json(productTypes.rows); // Sending all product types as a response
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // Method to get select values of product types
    getProductTypesSelectValues(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetching values of product types for filling select field options
                const selectValues = yield (0, db_1.dbQuery)({
                    text: `SELECT id, type as "optionValue" FROM product_types ORDER BY type ASC`,
                });
                res.status(200).json(selectValues.rows); // Sending select values as a response
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // Method to get a single product type
    getOneProductType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Fetching a single product type from the database
                const productType = yield (0, db_1.dbQuery)({
                    text: `SELECT ${productTypesCamelCase} FROM product_types WHERE id = $1`,
                    values: [id],
                });
                res.status(200).json(productType.rows[0]); // Sending the fetched product type as a response
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    // Method to update a product type
    updateProductType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productTypeId, type } = req.body;
                // Checking if productTypeId is a number and type is a string
                if (typeof productTypeId !== "number" && typeof type !== "string")
                    throw new Error("Неверный тип данных");
                // Updating a product type in the database
                yield (0, db_1.dbQuery)({
                    text: `UPDATE product_types SET type = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
                    values: [type, productTypeId],
                });
                res.sendStatus(204); // Sending a no content status as a response
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
    deleteProductType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Deleting a product type from the database
                yield (0, db_1.dbQuery)({
                    text: `DELETE FROM product_types WHERE id = $1`,
                    values: [id],
                });
                res.sendStatus(204); // Sending a no content status as a response
            }
            catch (error) {
                next(error); // Pass the error to the errorHandler middleware
            }
        });
    }
}
exports.default = new ProductTypesController();
