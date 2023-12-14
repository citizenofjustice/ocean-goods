import { Request, Response } from "express";
import db from "../db";

const catalogCamelCase: string = `id as "productId", product_name as "productName", product_type_id as "productTypeId", in_stoke as "inStoke", description, price, discount, weight, kcal, main_image as "mainImage"`;

class CatalogController {
  async createCatalogItem(req: Request, res: Response) {
    const item = await req.body;
    const newItem = await db.query(
      `INSERT INTO catalog
        (product_name, product_type_id, in_stoke, description, price, discount, weight, kcal, main_image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  RETURNING *`,
      [
        item.productName,
        item.productTypeId,
        item.inStoke,
        item.description,
        item.price,
        item.discount,
        item.weight,
        item.kcal,
        item.mainImage,
      ]
    );
    res.json(newItem.rows[0]);
  }
  async getCatalog(req: Request, res: Response) {
    const catalog = await db.query(`SELECT ${catalogCamelCase} FROM catalog`);
    res.json(catalog.rows);
  }
  async getCatalogItem(req: Request, res: Response) {
    const id = req.params.id;
    const catalogItem = await db.query(
      `SELECT ${catalogCamelCase} FROM catalog WHERE id = $1`,
      [id]
    );
    res.json(catalogItem.rows[0]);
  }
  async updateCatalogItem(req: Request, res: Response) {
    const { item } = req.body;
    const updatedItem = await db.query(
      `UPDATE catalog SET 
        product_name = $1,
        product_type_id = $2,
        in_stoke = $3,
        description = $4,
        price = $5,
        discount = $6,
        weight = $7,
        kcal = $8,
        main_image = $9
        WHERE id = $10 RETURNING *`,
      [
        item.productName,
        item.productTypeId,
        item.inStoke,
        item.description,
        item.price,
        item.discount,
        item.weight,
        item.kcal,
        item.main_image,
        item.id,
      ]
    );
    res.json(updatedItem.rows[0]);
  }
  async deleteCatalogItem(req: Request, res: Response) {
    const id = req.params.id;
    const catalogItem = await db.query(`DELETE FROM catalog WHERE id = $1`, [
      id,
    ]);
    res.json(catalogItem.rows[0]);
  }
}

export default new CatalogController();
