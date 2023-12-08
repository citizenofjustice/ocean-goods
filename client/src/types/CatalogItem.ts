// declaring interface for catalog item
export interface CatalogItem {
  productId: string;
  name: string;
  price: number;
  weight: number;
  kcal: number;
  image?: JSX.Element;
}
