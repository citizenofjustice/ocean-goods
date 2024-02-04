import { NextFunction, Request, Response } from "express";

import db from "../db";
import { ordersBot } from "../index";
import { Order } from "../types/Order";
import { handleOrderMessage } from "../bot/commands/orderMessage";

const orderCamelCase: string =
  'id as "orderId", order_details as "orderDetails", customer_name as "customerName", customer_phone as "customerPhone", customer_email as "customerEmail", contact_method as "contactMethod", created_at as "createdAt"';

// Function to get order by ID
export async function getOrderById(orderId: number) {
  try {
    // Query the database for the order (join with product types)
    const orderData = await db.query(
      `SELECT 
        orders.id as "orderId", orders.customer_name as "customerName", orders.customer_phone as "customerPhone",
        orders.customer_email as "customerEmail", orders.contact_method as "contactMethod", orders.created_at as "createdAt",
        json_build_object(
          'orderItems', json_agg(
            jsonb_set(
              elems::jsonb, 
              '{type}', 
              to_jsonb(product_types.type)
            )
          ),
          'totalPrice', orders.order_details->'totalPrice'
        ) AS "orderDetails"
      FROM 
        orders
      JOIN 
        jsonb_array_elements(orders.order_details->'orderItems') AS elems ON TRUE
      JOIN 
        product_types ON product_types.id = (elems->'productTypeId')::text::integer
      WHERE orders.id = $1
      GROUP BY 
        orders.id`,
      [orderId]
    );
    // Extract the order from the query result
    const foundOrder = orderData.rows[0];
    // Return the order
    return foundOrder;
  } catch (error) {
    // Log the error and rethrow it
    console.error(error);
    throw error;
  }
}

class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      // Destructure the request body
      const {
        orderDetails,
        customerName,
        customerPhone,
        customerEmail,
        contactMethod,
      } = req.body;

      if (JSON.parse(orderDetails).orderItems.length === 0)
        return res.status(422).json({ error: "Order details is empty" });

      // Prepare the SQL query
      const sqlQuery = `
        INSERT INTO orders (order_details, customer_name, customer_phone, customer_email, contact_method)
        VALUES ($1, $2, $3, $4, $5) RETURNING ${orderCamelCase}
      `;
      // Execute the query and get the result
      const createOrderQuery = await db.query(sqlQuery, [
        orderDetails,
        customerName,
        customerPhone,
        customerEmail,
        contactMethod,
      ]);

      // Extract the new order from the result
      const newOrder: Order = createOrderQuery.rows[0];
      // Pass new order to a telegram bot message
      handleOrderMessage(ordersBot.bot, newOrder);
      // Send the response
      res.json(newOrder);
    } catch (error) {
      next(error);
    }
  }
  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      // Destructure the query parameters from the request
      const { startDate, endDate, filterType, filter, orderBy, direction } =
        req.query;
      // Initialize an array to hold our WHERE clauses
      let whereClauses = [];
      // If a filter and filterType are provided, add a WHERE clause for the filter
      if (filter && filterType) {
        whereClauses.push(`${filterType}::text ILIKE '%${filter}%'`);
      }
      // If a startDate and endDate are provided, add a WHERE clause for the date range
      if (startDate && endDate) {
        whereClauses.push(`created_at BETWEEN '${startDate}' AND '${endDate}'`);
      }

      // Initialize the WHERE string
      let where = "";
      // If there are any WHERE clauses, join them with " AND " and prepend with "WHERE "
      if (whereClauses.length > 0) {
        where = `WHERE ${whereClauses.join(" AND ")}`;
      }

      // Default ORDER BY clause
      let orderByQuery = "ORDER BY created_at DESC";

      // If an orderBy and direction are provided, update the ORDER BY clause
      if (orderBy && direction) {
        if (orderBy === "totalPrice") {
          // If orderBy is "totalPrice", we need to cast it as an integer
          orderByQuery = `ORDER BY cast(order_details->>'totalPrice' as integer) ${direction}`;
        } else {
          // Otherwise, we can just use the provided orderBy field
          orderByQuery = `ORDER BY ${orderBy} ${direction}`;
        }
      }

      // Construct the final query
      const query = `SELECT ${orderCamelCase} FROM orders ${where} ${orderByQuery}`;
      const ordersQuery = await db.query(query);
      res.json(ordersQuery.rows);
    } catch (error) {
      next(error);
    }
  }
  async getOneOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Check if id is a number
      if (isNaN(Number(id)))
        return res.status(400).json({ error: "Invalid order ID." });

      // Get the order
      const foundOrder = await getOrderById(Number(id));
      // Check if the order exists
      if (!foundOrder)
        return res.status(404).json({ error: "Order not found." });

      // Send the order as the response
      res.json(foundOrder);
    } catch (error) {
      next(error);
    }
  }
  async updateOrder(req: Request, res: Response, next: NextFunction) {}
  async deleteOrder(req: Request, res: Response, next: NextFunction) {}
}

export default new OrderController();
