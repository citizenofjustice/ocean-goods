import { Request, Response } from "express";
import db from "../db";
import { uploadPictureAndGetUrl } from "../upload";

const catalogCamelCase: string = `id as "productId", product_name as "productName", product_type_id as "productTypeId", in_stoke as "inStock", description, price, discount, weight, kcal, main_image as "mainImage", created_at as "createdAt", updated_at as "updatedAt"`;

class CatalogController {
  async createCatalogItem(req: Request, res: Response) {
    const item = await req.body;
    let imageLink: string = "";
    if (req.file) imageLink = await uploadPictureAndGetUrl(req.file);
    const newItem = await db.query(
      `INSERT INTO catalog
        (product_name, product_type_id, in_stoke, description, price, discount, weight, kcal, main_image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  RETURNING *`,
      [
        item.productName,
        item.productTypeId,
        item.inStock ? true : false,
        item.description,
        item.price,
        item.discount,
        item.weight,
        item.kcal,
        imageLink,
      ]
    );
    res.json(newItem.rows[0]);
  }

  async getCatalog(req: Request, res: Response) {
    const catalog = await db.query(
      `SELECT ${catalogCamelCase} FROM catalog ORDER BY updated_at DESC`
    );
    res.json(catalog.rows);
  }

  async getCatalogItem(req: Request, res: Response) {
    const id = req.params.id;
    const catalogItem = await db.query(
      `SELECT catalog.id as "productId", catalog.product_name as "productName", catalog.product_type_id as "productTypeId", catalog.in_stoke as "inStock", catalog.description, catalog.price, catalog.discount, catalog.weight, catalog.kcal, catalog.main_image as "mainImage", catalog.created_at as "createdAt", catalog.updated_at as "updatedAt", product_types.type FROM catalog JOIN product_types ON catalog.product_type_id = product_types.id WHERE catalog.id = $1`,
      [id]
    );
    res.json(catalogItem.rows[0]);
  }

  async updateCatalogItem(req: Request, res: Response) {
    const id = req.params.id;
    const item = await req.body;

    let imageLink: string = "";
    if (req.file) {
      imageLink = await uploadPictureAndGetUrl(req.file);
    } else {
      imageLink = item.mainImage;
    }

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
        main_image = $9,
        updated_at = NOW()
        WHERE id = $10 RETURNING *`,
      [
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
