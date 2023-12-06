import { nanoid } from "nanoid";
import { makeAutoObservable } from "mobx";

import { CartItem } from "../types/cartItem";

// Cart item class implementing CartItem interface
class CartItemModel implements CartItem {
  cartItemId: string = nanoid();
  amount: number = 0;
  productId: string = nanoid();
  name: string;
  price: number;
  weigth: number;
  kcal: number;
  image?: JSX.Element;

  // calc cart item total price
  get totalProductPrice(): number {
    const totalProductPrice = this.amount * this.price;
    return totalProductPrice;
  }

  constructor(
    name: string,
    weigth: number,
    price: number,
    kcal: number,
    image?: JSX.Element
  ) {
    makeAutoObservable(this);
    this.name = name;
    this.price = price;
    this.weigth = weigth;
    this.kcal = kcal;
    this.image = image;
  }

  // increase cart item amount by 1
  incrementAmount(): void {
    this.amount++;
  }
  // decrease cart item amount by 1
  decrementAmount(): void {
    this.amount--;
  }
}

export default CartItemModel;
