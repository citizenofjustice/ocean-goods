import { nanoid } from "nanoid";
import { makeAutoObservable } from "mobx";

import { CartItem } from "@/types/CartItem";
import { BasicImage } from "@/types/BasicImage";

class CartItemModel implements CartItem {
  cartItemId: string = nanoid();
  productId: number;
  productName: string;
  productTypeId: number;
  amount: number = 1;
  inStock: boolean = true;
  description: string = "";
  price: number;
  discount: number;
  weight: number;
  kcal: number;
  mainImage?: BasicImage;

  // Getter to calculate the final price after discount
  get finalPrice(): number {
    return this.price - Math.round(this.price * (this.discount / 100));
  }

  // Getter to calculate the total price of the cart item
  get totalProductPrice(): number {
    const totalProductPrice = this.amount * this.finalPrice;
    return totalProductPrice;
  }

  // Constructor for the CartItemModel class
  constructor(
    productId: number,
    productName: string,
    productTypeId: number,
    amount: number,
    weight: number,
    price: number,
    discount: number,
    kcal: number,
    mainImage?: BasicImage
  ) {
    // Making all properties of this class observable for reactive programming
    makeAutoObservable(this);
    // Assigning values to properties
    this.productId = productId;
    this.productName = productName;
    this.productTypeId = productTypeId;
    this.amount = amount;
    this.price = price;
    this.discount = discount;
    this.weight = weight;
    this.kcal = kcal;
    this.mainImage = mainImage;
  }
}

export default CartItemModel;
