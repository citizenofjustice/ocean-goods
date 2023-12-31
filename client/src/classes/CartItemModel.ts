import { nanoid } from "nanoid";
import { makeAutoObservable } from "mobx";

import { CartItem } from "../types/CartItem";

// Cart item class implementing CartItem interface
class CartItemModel implements CartItem {
  cartItemId: string = nanoid();
  amount: number = 1;
  productId: number;
  productName: string;
  productTypeId: number;
  inStoke: boolean = true;
  description: string = "";
  price: number;
  discount: number;
  weight: number;
  kcal: number;
  mainImage?: string;

  // calc cart item total price
  get totalProductPrice(): number {
    const totalProductPrice = this.amount * this.price;
    return totalProductPrice;
  }

  constructor(
    // id: number,
    productId: number,
    productName: string,
    productTypeId: number,
    weight: number,
    price: number,
    discount: number,
    kcal: number,
    mainImage?: string
  ) {
    makeAutoObservable(this);
    this.productId = productId;
    this.productName = productName;
    this.productTypeId = productTypeId;
    this.price = price;
    this.discount = discount;
    this.weight = weight;
    this.kcal = kcal;
    this.mainImage = mainImage;
  }
}

export default CartItemModel;
