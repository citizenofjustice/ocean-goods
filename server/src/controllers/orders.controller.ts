import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

import { prisma } from "../db";
import { ordersBot } from "../index";
import { OrderItem } from "../types/OrderItem";
import { handleOrderMessage } from "../bot/commands/orderMessage";

interface orderItemPayload {
  amount: number;
  productId: number;
}

// Function to get order by ID
export async function getOrderById(orderId: number) {
  try {
    // Query the database for the order (join with product types)
    const orderData = await prisma.order.findUnique({
      where: {
        orderId: orderId,
      },
      include: {
        // Join order Items
        orderItems: true,
      },
    });

    // Check if the order exists
    if (!orderData)
      throw new Error("Заказа с таким номером не существует базе данных");

    // Return the order
    return orderData;
  } catch (error) {
    // Log the error and rethrow it
    console.error(error);
    throw error;
  }
}

class OrderController {
  // Destructure the request body to get customer details and order items
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      // Destructure the request body
      const {
        customerName,
        customerPhone,
        customerEmail,
        contactMethod,
        orderItems,
      } = req.body;

      // Parse the order items from the request body
      const parsedOrderItems = JSON.parse(orderItems);

      // Check if order details is empty and return an error if it is
      if (parsedOrderItems.length === 0)
        return res.status(422).json({
          error: {
            message: "Не удалось создать заказ. В заказе отсутствуют продукты.",
          },
        });

      // Fetch the products from the catalog that match the product IDs in the order items
      const orderProducts = await prisma.catalog.findMany({
        include: {
          mainImage: {
            select: {
              path: true,
            },
          },
          productTypes: {
            select: {
              type: true,
            },
          },
        },
        where: {
          productId: {
            in: parsedOrderItems.map((item: OrderItem) => item.productId),
          },
        },
      });

      // Calculate the total price for the order and prepare the order items
      const orderItemsData: OrderItem[] = parsedOrderItems.map(
        (item: orderItemPayload) => {
          const product = orderProducts.find(
            (catalogItem) => catalogItem.productId === item.productId
          );
          if (!product)
            return res.status(409).json({
              error: {
                message: `Не удалось создать заказ. Один из продуктов недоступен для заказа.`,
              },
            });
          const finalPrice =
            product.price -
            Math.round(product.price * (product.discount / 100));
          const totalPrice = item.amount * finalPrice;
          return {
            productId: item.productId,
            amount: item.amount,
            itemSnapshot: product,
            totalPrice,
          };
        }
      );

      // Calc total order price
      const totalOrderPrice: number = orderItemsData.reduce(
        (sum: number, item: OrderItem) => sum + item.totalPrice,
        0
      );

      // Prepare the Prisma query to create a new order
      const newOrder = await prisma.order.create({
        data: {
          customerName,
          customerPhone,
          customerEmail,
          contactMethod,
          totalOrderPrice,
          orderItems: {
            create: orderItemsData,
          },
        },
      });

      // Prepare the content for the order message
      const orderMessageContent = { ...newOrder, totalOrderPrice };

      // Pass new order to a telegram bot message
      await handleOrderMessage(ordersBot.bot, orderMessageContent);
      // Send the response status
      res.sendStatus(201);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // Method to get all orders
  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      // Destructure the query parameters from the request.
      // These parameters can be used to filter and sort the orders, and to paginate the results.
      const {
        startDate: startDateQuery,
        endDate: endDateQuery,
        filterType: filterTypeQuery,
        filter: filterQuery,
        orderBy: orderByQuery,
        direction: directionQuery,
        page: pageQuery = "1",
        limit: limitQuery = "10",
      } = req.query;

      // Convert query parameters to strings
      const startDate = startDateQuery as string;
      const endDate = endDateQuery as string;
      const filterType = filterTypeQuery as string;
      const filter = filterQuery as string;
      const orderBy = orderByQuery as string;
      const direction = directionQuery as string;
      const page = pageQuery as string;
      const limit = limitQuery as string;

      // Convert page and limit to numbers
      const pageNum = Number(page);
      const limitNum = Number(limit);

      // Define a function to validate the 'page' and 'limit' parameters.
      // These parameters must be positive integers.
      const validatePageLimit = (value: number, name: string) => {
        if (isNaN(value) || !Number.isInteger(value) || value <= 0) {
          throw new Error(`Invalid ${name}`);
        }
      };

      // Validate the 'page' and 'limit' parameters using the function defined above.
      try {
        validatePageLimit(pageNum, "page");
        validatePageLimit(limitNum, "limit");
      } catch (error) {
        // If the 'page' or 'limit' parameters are invalid, return a 400 status code and an error message.
        if (error instanceof Error) {
          return res.status(400).json({
            error: {
              message: `Возникла ошибка с параметрами загрузки страницы: ${error.message}`,
            },
          });
        }
      }

      // Calculate the offset for pagination
      //  This is the number of orders to skip before starting to return results.
      const skip = (pageNum - 1) * limitNum;

      // Define the initial query parameters.
      // These parameters will be used to query the database for orders.
      let queryParameters: Prisma.OrderFindManyArgs = {
        take: limitNum,
        skip: skip,
        include: {
          orderItems: true,
        },
      };

      // If the 'startDate' and 'endDate' parameters are provided, add a 'where' clause
      if (startDate && endDate) {
        queryParameters.where = {
          ...queryParameters.where,
          createdAt: {
            gte: new Date(startDate), // date must be greater than or equal to 'startDate'
            lte: new Date(endDate), // date must be less than or equal to 'endDate'
          },
        };
      }

      // Define a mapping from the 'orderBy' parameter to the corresponding field in the database.
      const orderByMapping: Record<
        string,
        keyof Prisma.OrderOrderByWithRelationInput
      > = {
        orderId: "orderId",
        createdAt: "createdAt",
        customerName: "customerName",
        totalPrice: "totalOrderPrice",
      };

      // If the 'orderBy' and 'direction' parameters are valid, add an 'orderBy' clause
      if (
        orderBy in orderByMapping &&
        (direction === "asc" || direction === "desc")
      ) {
        queryParameters.orderBy = {
          [orderByMapping[orderBy]]: direction,
        };
      }

      // Define a mapping from the 'filterType' parameter to the corresponding 'where' clause
      const filterTypeMapping: Record<string, any> = {
        orderId: { orderId: Number(filter) },
        customerName: {
          // Filter by customer name.
          customerName: {
            contains: filter,
            mode: "insensitive", // The filter is case-insensitive.
          },
        },
      };

      // If the 'filterType' and 'filter' parameters are provided, add a 'where' clause
      if (filterType in filterTypeMapping && filter) {
        queryParameters.where = {
          ...queryParameters.where,
          ...filterTypeMapping[filterType],
        };
      }

      // Query the database for orders using the query parameters defined above.
      const orders = await prisma.order.findMany(queryParameters);

      // Count the total number of orders in the database. This is used for pagination.
      const totalRows = await prisma.order.count();

      // Calculate the number of the next page, if there is one.
      const nextPage = totalRows > pageNum * limitNum ? pageNum + 1 : null;

      // Send the orders, the total number of orders, and the number of the next page as the response.
      res.status(200).json({ totalRows, orders, nextPage });
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // Method to get a single order by ID
  async getOneOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Check if id is a number
      if (isNaN(Number(id)))
        res
          .status(400)
          .json({ error: { message: "Неверный идентификатор заказа" } });

      // Get the order
      const foundOrder = await getOrderById(Number(id));
      // Check if the order exists
      if (!foundOrder)
        return res
          .status(404)
          .json({ error: { message: "Заказа с таким номером не существует" } });

      // Send the order as the response
      res.status(200).json(foundOrder);
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }

  // This function is not implemented yet
  async updateOrder(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(501);
  }

  // This function is not implemented yet
  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(501);
  }
}

export default new OrderController();
