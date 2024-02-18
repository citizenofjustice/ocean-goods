import { Request, Response, NextFunction } from "express";

import { dbQuery } from "../db";

// Defining the product types in camel case for SQL queries
const productTypesCamelCase: string = `id as "productTypeId", type, created_at as "createdAt", updated_at as "updatedAt"`;

class ProductTypesController {
  // Method to create a new product type
  async createProductType(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.body;
      // checking if type is a string
      if (typeof type !== "string") throw new Error("Неверный тип данных");
      //  inserting new product to database
      const newProductType = await dbQuery({
        text: `INSERT INTO product_types (type) VALUES ($1) RETURNING *`,
        values: [type],
      });
      res.status(201).json(newProductType.rows[0]); // Sending the newly created product type as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to get all product types
  async getProductTypes(req: Request, res: Response, next: NextFunction) {
    try {
      // Fetching all product types from the database
      const productTypes = await dbQuery({
        text: `SELECT ${productTypesCamelCase} FROM product_types ORDER BY updated_at DESC`,
      });
      res.status(200).json(productTypes.rows); // Sending all product types as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to get select values of product types
  async getProductTypesSelectValues(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Fetching values of product types for filling select field options
      const selectValues = await dbQuery({
        text: `SELECT id, type as "optionValue" FROM product_types ORDER BY type ASC`,
      });
      res.status(200).json(selectValues.rows); // Sending select values as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to get a single product type
  async getOneProductType(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Fetching a single product type from the database
      const productType = await dbQuery({
        text: `SELECT ${productTypesCamelCase} FROM product_types WHERE id = $1`,
        values: [id],
      });
      res.status(200).json(productType.rows[0]); // Sending the fetched product type as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to update a product type
  async updateProductType(req: Request, res: Response, next: NextFunction) {
    try {
      const { productTypeId, type } = req.body;
      // Checking if productTypeId is a number and type is a string
      if (typeof productTypeId !== "number" && typeof type !== "string")
        throw new Error("Неверный тип данных");
      // Updating a product type in the database
      await dbQuery({
        text: `UPDATE product_types SET type = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        values: [type, productTypeId],
      });
      res.sendStatus(204); // Sending a no content status as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  async deleteProductType(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Deleting a product type from the database
      await dbQuery({
        text: `DELETE FROM product_types WHERE id = $1`,
        values: [id],
      });
      res.sendStatus(204); // Sending a no content status as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }
}

export default new ProductTypesController();
