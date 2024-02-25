import { NextFunction, Request, Response } from "express";
import { Prisma, catalog } from "@prisma/client";

import { prisma } from "../db";
import { uploadPictureAndGetUrl } from "../upload";

class CatalogController {
  // method for creating a new catalogItem
  async createCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the item details from the request body
      const item = req.body;
      let imageLink = "";

      // If there is a file in the request, upload it and get the URL
      if (req.file) imageLink = await uploadPictureAndGetUrl(req.file);

      // Insert the new item into the database
      const newItem = await prisma.catalog.create({
        data: {
          productName: item.productName,
          productTypeId: Number(item.productTypeId),
          inStock: !!item.inStock,
          description: item.description,
          price: Number(item.price),
          discount: Number(item.discount),
          weight: Number(item.weight),
          kcal: Number(item.kcal),
          mainImage: imageLink,
        },
      });

      // Send the newly created item as the response
      res.status(201).json(newItem);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // method to get the entire catalog
  async getCatalog(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the search string and other parameters from the request
      const { filter, orderBy, direction, page = 1, limit = 25 } = req.query;

      // Convert page and limit to numbers
      const pageNum = Number(page);
      const limitNum = Number(limit);

      // Calculate the offset for pagination
      const skip = (pageNum - 1) * limitNum;

      // Define the query parameters
      let queryParameters: Prisma.catalogFindManyArgs = {
        take: limitNum,
        skip: skip,
      };

      // If a search string is provided, add a WHERE clause to the query
      if (filter) {
        queryParameters.where = {
          productName: {
            contains: filter.toString(),
            mode: "insensitive",
          },
        };
      }

      // Check if orderBy and direction are valid
      const sortByValid = orderBy === "productName" || orderBy === "createdAt";
      const directionValid = direction === "asc" || direction === "desc";

      // Set the orderBy parameter based on the provided orderBy value
      if (sortByValid && directionValid) {
        switch (orderBy) {
          case "createdAt":
            queryParameters.orderBy = {
              createdAt: direction,
            };
            break;
          case "productName":
            queryParameters.orderBy = {
              productName: direction,
            };
            break;
          default:
            break;
        }
      }

      // Query the database for items in the catalog
      const catalogQuery = await prisma.catalog.findMany(queryParameters);

      // Count the total rows
      const totalRows = await prisma.catalog.count();

      // Calculate the cursor for the next page
      const nextPage = totalRows > pageNum * limitNum ? pageNum + 1 : null;

      let catalog;
      // If orderBy is "finalPrice", sort the catalog items by final price
      if (orderBy === "finalPrice" && directionValid) {
        catalog = sortByFinalPrice(catalogQuery, direction);
      } else catalog = catalogQuery;

      // Send the catalog items as the response
      res.status(200).json({ totalRows, catalog, nextPage });
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // method for retrieving a specific catalogItem
  async getCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the item ID from the request parameters
      const id = parseInt(req.params.id);

      // The findUnique method is used to retrieve a single record that matches the where clause
      // The include option is used to include the related productTypes records in the result
      const catalogItem = await prisma.catalog.findUnique({
        where: { productId: id },
        include: {
          productTypes: {
            select: {
              type: true,
            },
          },
        },
      });

      // If the catalogItem is not found in the database, return a 404 status code and an error message
      if (!catalogItem)
        return res.status(404).json({
          error: {
            message:
              "В базе данных отсутствует продукт с данным идентификатором",
          },
        });

      // Send the catalog item as the response
      res.status(200).json(catalogItem);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // method for Updating a catalogItem
  async updateCatalogItem(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the item ID from the request parameters
      const id = parseInt(req.params.id);

      // Get the updated item details from the request body
      const item = await req.body;

      // If there is a new file in the request, upload it and get the URL, otherwise keep old value
      let imageLink = req.file
        ? await uploadPictureAndGetUrl(req.file)
        : item.mainImage;

      // Update the item in the database using Prisma
      await prisma.catalog.update({
        where: { productId: id },
        data: {
          productName: item.productName,
          productTypeId: Number(item.productTypeId),
          inStock: !!item.inStock,
          description: item.description,
          price: Number(item.price),
          discount: Number(item.discount),
          weight: Number(item.weight),
          kcal: Number(item.kcal),
          mainImage: imageLink,
          updatedAt: new Date(),
        },
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
      const id = parseInt(req.params.id);

      // Delete the item from the database
      await prisma.catalog.delete({
        where: {
          productId: id,
        },
      });

      // Send a success status
      res.sendStatus(204);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }
}

/**
 * This function sorts an array of catalog items by their final price.
 * The final price is calculated as the original price minus the discount.
 *
 * @param catalogItems - An array of catalog items to sort.
 * @param direction - The direction to sort the items. Can be "asc" for ascending or "desc" for descending.
 * @throws {Error} Will throw an error if the direction is not "asc" or "desc".
 * @returns An array of catalog items sorted by their final price.
 */
const sortByFinalPrice = (
  catalogItems: catalog[],
  direction: "asc" | "desc"
) => {
  // Calculate the final price for each item
  const itemsWithFinalPrice = catalogItems.map((item) => ({
    ...item,
    finalPrice: item.price - Math.round((item.price * item.discount) / 100),
  }));

  // Sort the items by the final price in the specified direction
  switch (direction) {
    case "asc":
      itemsWithFinalPrice.sort((a, b) => a.finalPrice - b.finalPrice);
      break;
    case "desc":
      itemsWithFinalPrice.sort((a, b) => b.finalPrice - a.finalPrice);
      break;
    default:
      throw new Error(
        `Invalid sort direction: ${direction}. Expected "asc" or "desc".`
      );
  }

  return itemsWithFinalPrice;
};

export default new CatalogController();
