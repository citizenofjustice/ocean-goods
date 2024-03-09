import { OrderItem } from "./OrderItem";

export interface Order {
  orderId: number;
  totalOrderPrice: number;
  orderItems: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  contactMethod: string;
  createdAt: string;
}
