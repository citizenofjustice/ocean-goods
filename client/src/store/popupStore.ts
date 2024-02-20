import { action, makeAutoObservable } from "mobx";
import { PopupMessage } from "../types/Popup";

// Class for the popup store
class PopupStore {
  // Observable property for the popup message
  popup: PopupMessage | null = null;

  // Constructor for the PopupStore class
  constructor() {
    // Making all properties of this class observable and actions for MobX
    makeAutoObservable(this, {
      setPopup: action,
      clearPopup: action,
    });
  }

  // Action to set the popup message
  setPopup = (popup: PopupMessage) => {
    try {
      // Setting the popup message
      this.popup = { message: popup.message, type: popup.type };
    } catch (error) {
      // Log the error and handle it appropriately
      console.error("Failed to set popup:", error);
    }
  };

  // Action to clear the popup message
  clearPopup = () => {
    try {
      // Clearing the popup message
      this.popup = null;
    } catch (error) {
      // Log the error and handle it appropriately
      console.error("Failed to clear popup:", error);
    }
  };
}

export default new PopupStore();
