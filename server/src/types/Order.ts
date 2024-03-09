import { OrderItem } from "./OrderItem";

export interface Order {
  orderId: number;
  totalPrice: number;
  orderItems: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  contactMethod: string | null;
  createdAt: Date;
  updatedAt: Date;
}
