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
const sortByPrice_1 = require("../utils/sortByPrice");
class CatalogController {
    // method for creating a new catalogItem
    createCatalogItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the item details from the request body
                const item = req.body;
                let image;
                // If there is a file in the request, upload it and get the URL
                if (req.file) {
                    // First, create an image record
                    image = yield db_1.prisma.image.create({
                        data: {
                            path: req.file.path,
                            filename: req.file.filename,
                            originalName: req.file.originalname,
                            mimetype: req.file.mimetype,
                        },
                    });
                }
                // Insert the new item into the database
                const newItem = yield db_1.prisma.catalog.create({
                    data: {
                        productName: item.productName,
                        productTypeId: Number(item.productTypeId),
                        inStock: !!item.inStock,
                        description: item.description,
                        price: Number(item.price),
                        discount: Number(item.discount),
                        weight: Number(item.weight),
                        kcal: Number(item.kcal),
                        mainImageId: image ? Number(image.imageId) : null,
                    },
                });
                // Send the newly created item as the response
                res.status(201).json(newItem);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method to get the entire catalog
    getCatalog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the search string and other parameters from the request
                const { filter, orderBy, direction, page = 1, limit = 25 } = req.query;
                // Convert page and limit to numbers
                const pageNum = Number(page);
                const limitNum = Number(limit);
                // Calculate the offset for pagination
                const skip = (pageNum - 1) * limitNum;
                // Define the query parameters
                let queryParameters = {
                    take: limitNum,
                    skip: skip,
                    include: {
                        mainImage: {
                            select: {
                                path: true,
                            },
                        },
                    },
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
                const catalogQuery = yield db_1.prisma.catalog.findMany(queryParameters);
                // Count the total rows
                const totalRows = yield db_1.prisma.catalog.count();
                // Calculate the cursor for the next page
                const nextPage = totalRows > pageNum * limitNum ? pageNum + 1 : null;
                let catalog;
                // If orderBy is "finalPrice", sort the catalog items by final price
                if (orderBy === "finalPrice" && directionValid) {
                    catalog = (0, sortByPrice_1.sortByFinalPrice)(catalogQuery, direction);
                }
                else
                    catalog = catalogQuery;
                // Send the catalog items as the response
                res.status(200).json({ totalRows, catalog, nextPage });
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method for retrieving a specific catalogItem
    getCatalogItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the item ID from the request parameters
                const id = parseInt(req.params.id);
                // The findUnique method is used to retrieve a single record that matches the where clause
                // The include option is used to include the related productTypes records in the result
                const catalogItem = yield db_1.prisma.catalog.findUnique({
                    where: { productId: id },
                    include: {
                        productTypes: {
                            select: {
                                type: true,
                            },
                        },
                        mainImage: {
                            select: {
                                path: true,
                            },
                        },
                    },
                });
                // If the catalogItem is not found in the database, return a 404 status code and an error message
                if (!catalogItem)
                    return res.status(404).json({
                        error: {
                            message: "В базе данных отсутствует продукт с данным идентификатором",
                        },
                    });
                // Send the catalog item as the response
                res.status(200).json(catalogItem);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method for Updating a catalogItem
    updateCatalogItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the item ID from the request parameters
                const id = parseInt(req.params.id);
                // Get the updated item details from the request body
                const item = yield req.body;
                // If there is a new file in the request, upload it and get the URL, otherwise keep old value
                let image;
                // If there is a file in the request, upload it and get the URL
                if (req.file) {
                    // First, create an image record
                    image = yield db_1.prisma.image.create({
                        data: {
                            path: req.file.path,
                            filename: req.file.filename,
                            originalName: req.file.originalname,
                            mimetype: req.file.mimetype,
                        },
                    });
                }
                else {
                    if (typeof item.mainImage === "string" && item.mainImage === "") {
                        image = null;
                    }
                    else
                        image = undefined;
                }
                // Update the item in the database using Prisma
                yield db_1.prisma.catalog.update({
                    where: { productId: id },
                    data: {
                        productName: item.productName,
                        productTypeId: Number(item.productTypeId),
                        inStock: item.inStock === "true" ? true : false,
                        description: item.description,
                        price: Number(item.price),
                        discount: Number(item.discount),
                        weight: Number(item.weight),
                        kcal: Number(item.kcal),
                        mainImageId: image ? Number(image.imageId) : image,
                        updatedAt: new Date(),
                    },
                });
                // Send a success status
                res.sendStatus(204);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
    // method for deleting a catalogItem
    deleteCatalogItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the item ID from the request parameters
                const id = parseInt(req.params.id);
                // Delete the item from the database
                yield db_1.prisma.catalog.delete({
                    where: {
                        productId: id,
                    },
                });
                // Send a success status
                res.sendStatus(204);
            }
            catch (error) {
                // Pass the error to the errorHandler middleware
                next(error);
            }
        });
    }
}
exports.default = new CatalogController();
