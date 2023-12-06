// declaring interface for catalog item
export interface CatalogItem {
  productId: string;
  name: string;
  price: number;
  weigth: number;
  kcal: number;
  image?: JSX.Element;
}
