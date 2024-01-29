import { Request, Response } from "express";
import db from "../db";
import { Order } from "../types/Order";
import { bot } from "../index";
import { handleOrderMessage } from "../bot.commands";

const orderCamelCase: string =
  'id as "orderId", order_details as "orderDetails", customer_name as "customerName", customer_phone as "customerPhone", customer_email as "customerEmail", contact_method as "contactMethod", created_at as "createdAt"';

class OrderController {
  async createOrder(req: Request, res: Response) {
    const {
      orderDetails,
      customerName,
      customerPhone,
      customerEmail,
      contactMethod,
    } = req.body;
    const createOrderQuery = await db.query(
      `INSERT INTO orders (order_details, customer_name, customer_phone, customer_email, contact_method)
        VALUES ($1, $2, $3, $4, $5)  RETURNING ${orderCamelCase}`,
      [orderDetails, customerName, customerPhone, customerEmail, contactMethod]
    );
    const newOrder: Order = createOrderQuery.rows[0];
    handleOrderMessage(bot, newOrder);
    res.json(newOrder);
  }
  async getOrders(req: Request, res: Response) {
    const ordersQuery = await db.query(
      `SELECT ${orderCamelCase} FROM orders ORDER BY created_at DESC`
    );
    res.json(ordersQuery.rows);
  }
  async getOneOrder(req: Request, res: Response) {}
  async updateOrder(req: Request, res: Response) {}
  async deleteOrder(req: Request, res: Response) {}
}

export default new OrderController();
