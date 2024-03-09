import { Request, Response, NextFunction } from "express";

import { prisma } from "../db";

class ProductTypesController {
  // Method to create a new product type
  async createProductType(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.body;
      // checking if type is a string
      if (typeof type !== "string") throw new Error("Неверный тип данных");
      //  inserting new product to database
      const newProductType = await prisma.productTypes.create({
        data: {
          type: type,
        },
      });
      res.status(201).json(newProductType); // Sending the newly created product type as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to get all product types
  async getProductTypes(req: Request, res: Response, next: NextFunction) {
    try {
      // Fetching all product types from the database
      const productTypes = await prisma.productTypes.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      });
      res.status(200).json(productTypes); // Sending all product types as a response
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
      const selectValues = await prisma.productTypes.findMany({
        select: {
          productTypeId: true,
          type: true,
        },
        orderBy: {
          type: "asc",
        },
      });
      res.status(200).json(selectValues); // Sending select values as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to get a single product type
  async getOneProductType(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      // Fetching a single product type from the database
      const productType = await prisma.productTypes.findUnique({
        where: {
          productTypeId: id,
        },
      });
      res.status(200).json(productType); // Sending the fetched product type as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  // Method to update a product type
  async updateProductType(req: Request, res: Response, next: NextFunction) {
    try {
      const { productTypeId, type } = req.body;
      // Checking if productTypeId is a number and type is a string
      if (typeof productTypeId !== "number" || typeof type !== "string")
        throw new Error("Неверный тип данных");
      // Updating a product type in the database
      await prisma.productTypes.update({
        where: {
          productTypeId: productTypeId,
        },
        data: {
          type: type,
        },
      });
      res.sendStatus(204); // Sending a no content status as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }

  async deleteProductType(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      // Deleting a product type from the database
      await prisma.productTypes.delete({
        where: {
          productTypeId: id,
        },
      });
      res.sendStatus(204); // Sending a no content status as a response
    } catch (error) {
      next(error); // Pass the error to the errorHandler middleware
    }
  }
}

export default new ProductTypesController();
