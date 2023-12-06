import { makeAutoObservable } from "mobx";

import CartItemModel from "../classes/CartItemModel";
import tmpImg from "../assets/images/tmp.jpg"; //when removing change file extension

// creating store class for keeping cart items
class cartStore {
  cartItems?: CartItemModel[] = [
    new CartItemModel("Горбуша", 200, 320, 80, <img src={tmpImg} />),
    new CartItemModel("Тунец", 250, 280, 90, <img src={tmpImg} />),
    new CartItemModel("Сайра", 230, 350, 120, <img src={tmpImg} />),
  ];

  constructor() {
    makeAutoObservable(this);
  }
}

export default new cartStore();
