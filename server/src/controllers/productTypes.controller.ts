import { Request, Response } from "express";
import db from "../db";

const productTypesCamelCase: string = `id as "productTypeId", type`;

class ProductTypesController {
  async createProductType(req: Request, res: Response) {
    const { type } = req.body;
    const newProductType = await db.query(
      `INSERT INTO product_types (type) VALUES ($1) RETURNING *`,
      [type]
    );
    res.json(newProductType.rows[0]);
  }
  async getProductTypes(req: Request, res: Response) {
    const productTypes = await db.query(
      `SELECT ${productTypesCamelCase} FROM product_types`
    );
    res.json(productTypes.rows);
  }
  async getOneProductType(req: Request, res: Response) {
    const { id } = req.params;
    const productType = await db.query(
      `SELECT ${productTypesCamelCase} FROM product_types WHERE id = $1`,
      [id]
    );
    res.json(productType.rows[0]);
  }
  async updateProductType(req: Request, res: Response) {
    const { id } = req.params;
    const { newType } = req.body;
    const updatedProductType = await db.query(
      `UPDATE product_types SET type = $1 WHERE id = $2 RETURNING`,
      [newType, id]
    );
    res.json(updatedProductType.rows[0]);
  }
  async deleteProductType(req: Request, res: Response) {
    const { id } = req.params;
    const productType = await db.query(
      `DELETE FROM product_types WHERE id = $1`,
      [id]
    );
    res.json(productType.rows[0]);
  }
}

export default new ProductTypesController();
