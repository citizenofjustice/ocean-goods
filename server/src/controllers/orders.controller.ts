import { Request, Response } from "express";

import db from "../db";
import { ordersBot } from "../index";
import { Order } from "../types/Order";
import { handleOrderMessage } from "../bot/commands/orderMessage";

const orderCamelCase: string =
  'id as "orderId", order_details as "orderDetails", customer_name as "customerName", customer_phone as "customerPhone", customer_email as "customerEmail", contact_method as "contactMethod", created_at as "createdAt"';

export async function getOrderById(orderId: number) {
  try {
    const orderData = await db.query(
      `SELECT ${orderCamelCase} FROM orders WHERE id = $1`,
      [orderId]
    );
    const foundOrder = orderData.rows[0];
    return foundOrder;
  } catch (error) {
    console.log(error);
  }
}

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
    handleOrderMessage(ordersBot.bot, newOrder);
    res.json(newOrder);
  }
  async getOrders(req: Request, res: Response) {
    const ordersQuery = await db.query(
      `SELECT ${orderCamelCase} FROM orders ORDER BY created_at DESC`
    );
    res.json(ordersQuery.rows);
  }
  async getOneOrder(req: Request, res: Response) {
    const id = Number(req.params.id);
    const foundOrder = await getOrderById(id);
    res.json(foundOrder);
  }
  async updateOrder(req: Request, res: Response) {}
  async deleteOrder(req: Request, res: Response) {}
}

export default new OrderController();
