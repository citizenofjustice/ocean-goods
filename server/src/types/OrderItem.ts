import { Catalog } from "@prisma/client";

export interface OrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  amount: number;
  itemSnapshot: Catalog;
}
