import { Request, Response } from "express";
import db, { dbQuery } from "../db";

const productTypesCamelCase: string = `id as "productTypeId", type, created_at as "createdAt", updated_at as "updatedAt"`;

class ProductTypesController {
  async createProductType(req: Request, res: Response) {
    const { type } = req.body;
    const newProductType = await dbQuery({
      text: `INSERT INTO product_types (type) VALUES ($1) RETURNING *`,
      values: [type],
    });
    res.json(newProductType.rows[0]);
  }
  async getProductTypes(req: Request, res: Response) {
    const productTypes = await dbQuery({
      text: `SELECT ${productTypesCamelCase} FROM product_types ORDER BY updated_at DESC`,
    });
    res.json(productTypes.rows);
  }
  async getProductTypesSelectValues(req: Request, res: Response) {
    const selectValues = await dbQuery({
      text: `SELECT id, type as "optionValue" FROM product_types ORDER BY type ASC`,
    });
    res.json(selectValues.rows);
  }
  async getOneProductType(req: Request, res: Response) {
    const { id } = req.params;
    const productType = await dbQuery({
      text: `SELECT ${productTypesCamelCase} FROM product_types WHERE id = $1`,
      values: [id],
    });
    res.json(productType.rows[0]);
  }
  async updateProductType(req: Request, res: Response) {
    const { productTypeId, type } = req.body;
    const updatedProductType = await dbQuery({
      text: `UPDATE product_types SET type = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      values: [type, productTypeId],
    });
    res.json(updatedProductType.rows[0]);
  }
  async deleteProductType(req: Request, res: Response) {
    const { id } = req.params;
    const productType = await dbQuery({
      text: `DELETE FROM product_types WHERE id = $1`,
      values: [id],
    });
    res.json(productType.rows[0]);
  }
}

export default new ProductTypesController();
