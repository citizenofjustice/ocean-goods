// declaring interface for catalog item
export interface CatalogItem {
  productId: number;
  productName: string;
  productTypeId: number;
  inStock: boolean;
  description: string;
  price: number;
  discount: number;
  weight: number;
  kcal: number;
  mainImage?: string;
}
