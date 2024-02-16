import { NextFunction, Request, Response } from "express";
import { dbQuery } from "../db";
import { uploadPictureAndGetUrl } from "../upload";

const catalogCamelCase: string = `id as "productId", product_name as "productName", product_type_id as "productTypeId", in_stoke as "inStock", description, price, discount, weight, kcal, main_image as "mainImage", created_at as "createdAt", updated_at as "updatedAt"`;

class CatalogController {
  async createCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await req.body;
      let imageLink: string = "";
      if (req.file) imageLink = await uploadPictureAndGetUrl(req.file);
      const newItem = await dbQuery({
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
      res.status(201).json(newItem.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async getCatalog(req: Request, res: Response, next: NextFunction) {
    try {
      const catalog = await dbQuery({
        text: `SELECT ${catalogCamelCase} FROM catalog ORDER BY updated_at DESC`,
      });
      res.json(catalog.rows);
    } catch (error) {
      next(error);
    }
  }

  async getCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const catalogItem = await dbQuery({
        text: `SELECT catalog.id as "productId", catalog.product_name as "productName", catalog.product_type_id as "productTypeId", catalog.in_stoke as "inStock", catalog.description, catalog.price, catalog.discount, catalog.weight, catalog.kcal, catalog.main_image as "mainImage", catalog.created_at as "createdAt", catalog.updated_at as "updatedAt", product_types.type FROM catalog JOIN product_types ON catalog.product_type_id = product_types.id WHERE catalog.id = $1`,
        values: [id],
      });
      res.json(catalogItem.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async updateCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const item = await req.body;

      let imageLink: string = "";
      if (req.file) {
        imageLink = await uploadPictureAndGetUrl(req.file);
      } else {
        imageLink = item.mainImage;
      }

      await dbQuery({
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
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  async deleteCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const catalogItem = await dbQuery({
        text: `DELETE FROM catalog WHERE id = $1`,
        values: [id],
      });
      res.json(catalogItem.rows[0]);
    } catch (error) {
      next(error);
    }
  }
}

export default new CatalogController();
