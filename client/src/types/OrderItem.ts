import { CatalogItem } from "./CatalogItem";

export interface OrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  amount: number;
  itemSnapshot: CatalogItem;
}
