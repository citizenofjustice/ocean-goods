import { NextFunction, Request, Response } from "express";

import { dbQuery, prisma } from "../db";
import { ordersBot } from "../index";
import { OrderItem } from "../types/OrderItem";
import { handleOrderMessage } from "../bot/commands/orderMessage";
import { Prisma } from "@prisma/client";

// Function to get order by ID
export async function getOrderById(orderId: number) {
  try {
    // Query the database for the order (join with product types)
    const orderData = await prisma.order.findUnique({
      where: {
        orderId: orderId,
      },
      include: {
        orderItems: {
          include: {
            catalogItem: {
              include: {
                productTypes: true,
              },
            },
          },
        },
      },
    });

    // Check if the order exists
    if (!orderData) throw new Error("Заказа с таким номером не существует");

    // Return the order
    return orderData;
  } catch (error) {
    // Log the error and rethrow it
    console.error(error);
    throw error;
  }
}

class OrderController {
  // Method to create a new order
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

      const parsedOrderItems = JSON.parse(orderItems);

      const opderProducts = await prisma.catalog.findMany({
        where: {
          productId: {
            in: parsedOrderItems.map((item: OrderItem) => item.productId),
          },
        },
      });

      const itemsWithAmount = opderProducts.map((item) => {
        const orderItem = parsedOrderItems.find(
          (orderItem: OrderItem) => orderItem.productId === item.productId
        );
        return {
          ...item,
          amount: orderItem ? orderItem.amount : 0,
        };
      });

      let totalPrice = 0;
      for (const item of itemsWithAmount) {
        const finalPrice =
          item.price - Math.round(item.price * (item.discount / 100));
        totalPrice += item.amount * finalPrice;
      }

      // Check if order details is empty
      if (parsedOrderItems.length === 0)
        return res.status(422).json({
          error: "Не удалось создать заказ. В заказе отсутствуют продукты.",
        });

      // Prepare the Prisma query
      const newOrder = await prisma.order.create({
        data: {
          customerName: customerName,
          customerPhone: customerPhone,
          customerEmail: customerEmail,
          contactMethod: contactMethod,
          totalPrice: totalPrice,
          orderItems: {
            create: parsedOrderItems.map((item: OrderItem) => {
              const snapshot = opderProducts.find(
                (catalogItem) => catalogItem.productId === item.productId
              );
              return {
                productId: item.productId,
                amount: item.amount,
                itemSnapshot: snapshot,
              };
            }),
          },
        },
      });

      const orderMessageContent = { ...newOrder, totalPrice };

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
      // Destructure the query parameters from the request
      const {
        startDate,
        endDate,
        filterType,
        filter,
        orderBy,
        direction,
        page = 1,
        limit = 10,
      } = req.query;
      // Convert page and limit to numbers
      const pageNum = Number(page);
      const limitNum = Number(limit);

      // Check if page and limit are numbers
      if (isNaN(pageNum) || isNaN(limitNum)) {
        return res.status(400).json({
          error: {
            message: "Возникла ошибка с параметрами загрузки страницы",
          },
        });
      }

      // Check if page and limit are natural numbers
      if (!Number.isInteger(pageNum) || pageNum <= 0) {
        return res.status(400).json({
          error: {
            message: "Номер страницы не должен быть отрицательным",
          },
        });
      }
      if (!Number.isInteger(limitNum) || limitNum <= 0) {
        return res.status(400).json({
          error: {
            message:
              "Параметр кол-ва элементов на странице не должен быть отрицательным",
          },
        });
      }

      // Calculate the offset for pagination
      const skip = (pageNum - 1) * limitNum;

      // Define the query parameters
      let queryParameters: Prisma.OrderFindManyArgs = {
        take: limitNum,
        skip: skip,
        include: {
          orderItems: true,
        },
      };

      const startDateStr = startDate?.toString();
      const endDateStr = endDate?.toString();
      if (startDateStr && endDateStr) {
        queryParameters.where = {
          ...queryParameters.where,
          createdAt: {
            gte: new Date(startDateStr),
            lte: new Date(endDateStr),
          },
        };
      }

      // Check if orderBy and direction are valid
      const sortByValid =
        orderBy === "createdAt" ||
        orderBy === "totalPrice" ||
        orderBy === "customerName";
      const filterTypeIsValid =
        filterType === "orderId" || filterType === "customerName";

      const directionValid = direction === "asc" || direction === "desc";

      // Set the orderBy parameter based on the provided orderBy value
      if (sortByValid && directionValid) {
        switch (orderBy) {
          case "createdAt":
            queryParameters.orderBy = {
              createdAt: direction,
            };
            break;
          case "customerName":
            queryParameters.orderBy = {
              customerName: direction,
            };
            break;
          case "totalPrice":
            queryParameters.orderBy = {
              totalPrice: direction,
            };
            break;
          default:
            break;
        }
      }

      if (filterTypeIsValid && filter) {
        switch (filterType) {
          case "orderId":
            queryParameters.where = {
              ...queryParameters.where,
              orderId: Number(filter),
            };
            break;
          case "customerName":
            queryParameters.where = {
              ...queryParameters.where,
              customerName: {
                contains: filter.toString(),
                mode: "insensitive",
              },
            };
            break;
          default:
            break;
        }
      }

      // Query the database for items in the order
      const orders = await prisma.order.findMany(queryParameters);

      // Count the total rows
      const totalRows = await prisma.order.count();

      // Calculate the cursor for the next page
      const nextPage = totalRows > pageNum * limitNum ? pageNum + 1 : null;

      // Send the catalog items as the response
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
          .json({ error: { message: "Не верный идентификатор заказа" } });

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
