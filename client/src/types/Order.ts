import { OrderItem } from "./OrderItem";

export interface Order {
  orderId: number;
  orderDetails: {
    orderItems: OrderItem[];
    totalPrice: number;
  };
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  contactMethod: string;
  createdAt: string;
}
