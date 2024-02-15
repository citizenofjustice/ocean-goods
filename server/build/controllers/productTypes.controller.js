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
const productTypesCamelCase = `id as "productTypeId", type, created_at as "createdAt", updated_at as "updatedAt"`;
class ProductTypesController {
    createProductType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type } = req.body;
            const newProductType = yield (0, db_1.dbQuery)({
                text: `INSERT INTO product_types (type) VALUES ($1) RETURNING *`,
                values: [type],
            });
            res.json(newProductType.rows[0]);
        });
    }
    getProductTypes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productTypes = yield (0, db_1.dbQuery)({
                text: `SELECT ${productTypesCamelCase} FROM product_types ORDER BY updated_at DESC`,
            });
            res.json(productTypes.rows);
        });
    }
    getProductTypesSelectValues(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selectValues = yield (0, db_1.dbQuery)({
                    text: `SELECT id, type as "optionValue" FROM product_types ORDER BY type ASC`,
                });
                res.status(200).json(selectValues.rows);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOneProductType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const productType = yield (0, db_1.dbQuery)({
                text: `SELECT ${productTypesCamelCase} FROM product_types WHERE id = $1`,
                values: [id],
            });
            res.json(productType.rows[0]);
        });
    }
    updateProductType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productTypeId, type } = req.body;
            const updatedProductType = yield (0, db_1.dbQuery)({
                text: `UPDATE product_types SET type = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
                values: [type, productTypeId],
            });
            res.json(updatedProductType.rows[0]);
        });
    }
    deleteProductType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const productType = yield (0, db_1.dbQuery)({
                text: `DELETE FROM product_types WHERE id = $1`,
                values: [id],
            });
            res.json(productType.rows[0]);
        });
    }
}
exports.default = new ProductTypesController();
