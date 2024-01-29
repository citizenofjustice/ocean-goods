export interface OrderItem {
  productId: number;
  productTypeId: number;
  productName: string;
  amount: number;
  totalProductPrice: number;
  mainImage?: string;
}
