// declaring interface for catalog item
export interface CatalogItem {
  id: number;
  productName: string;
  productTypeId: number;
  inStoke: boolean;
  description: string;
  price: number;
  discount: number;
  weight: number;
  kcal: number;
  mainImage?: string;
}
