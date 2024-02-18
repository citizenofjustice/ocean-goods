import { NextFunction, Request, Response } from "express";

import { dbQuery } from "../db";
import { uploadPictureAndGetUrl } from "../upload";

// String to convert column names to camelCase
const catalogCamelCase: string = `id as "productId", product_name as "productName", product_type_id as "productTypeId", in_stoke as "inStock", description, price, discount, weight, kcal, main_image as "mainImage", created_at as "createdAt", updated_at as "updatedAt"`;

class CatalogController {
  // method for creating a new catalogItem
  async createCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the item details from the request body
      const item = await req.body;
      let imageLink: string = "";
      // If there is a file in the request, upload it and get the URL
      if (req.file) imageLink = await uploadPictureAndGetUrl(req.file);

      // Insert the new item into the database
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

      // Send the newly created item as the response
      res.status(201).json(newItem.rows[0]);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // method to get the entire catalog
  async getCatalog(req: Request, res: Response, next: NextFunction) {
    try {
      // Query the database for all items in the catalog
      const catalog = await dbQuery({
        text: `SELECT ${catalogCamelCase} FROM catalog ORDER BY updated_at DESC`,
      });
      // Send the catalog items as the response
      res.status(200).json(catalog.rows);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // method for retrieving a specific catalogItem
  async getCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the item ID from the request parameters
      const id = req.params.id;
      // Query the database for the specific item
      const catalogItem = await dbQuery({
        text: `SELECT catalog.id as "productId", catalog.product_name as "productName", catalog.product_type_id as "productTypeId", catalog.in_stoke as "inStock", catalog.description, catalog.price, catalog.discount, catalog.weight, catalog.kcal, catalog.main_image as "mainImage", catalog.created_at as "createdAt", catalog.updated_at as "updatedAt", product_types.type FROM catalog JOIN product_types ON catalog.product_type_id = product_types.id WHERE catalog.id = $1`,
        values: [id],
      });
      // Send the catalog item as the response
      res.status(200).json(catalogItem.rows[0]);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // method for Updating a catalogItem
  async updateCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the item ID from the request parameters
      const id = req.params.id;
      // Get the updated item details from the request body
      const item = await req.body;

      let imageLink: string = "";
      // If there is a file in the request, upload it and get the URL
      if (req.file) {
        imageLink = await uploadPictureAndGetUrl(req.file);
      } else {
        imageLink = item.mainImage;
      }

      // Update the item in the database
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
      // Send a success status
      res.sendStatus(204);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // method for deleting a catalogItem
  async deleteCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the item ID from the request parameters
      const id = req.params.id;
      // Delete the item from the database
      await dbQuery({
        text: `DELETE FROM catalog WHERE id = $1`,
        values: [id],
      });
      // Send a success status
      res.sendStatus(204);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }
}

export default new CatalogController();
