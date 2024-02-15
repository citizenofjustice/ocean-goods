import { makeAutoObservable } from "mobx";
import { PopupMessage } from "../types/Popup";

class PopupStore {
  popup: PopupMessage | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPopup = (popup: PopupMessage) => {
    this.popup = { message: popup.message, type: popup.type };
  };

  clearPopup = () => {
    this.popup = null;
  };
}

export default new PopupStore();
