import { CatalogItem } from "./CatalogItem";

// extend interface of catalog item with amount
export interface CartItem extends CatalogItem {
  id: number;
  amount: number;
}
