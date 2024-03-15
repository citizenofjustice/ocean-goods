import { CatalogItem } from "@/types/CatalogItem";

// extend interface of catalog item with amount
export interface CartItem extends CatalogItem {
  cartItemId: string;
  amount: number;
}
