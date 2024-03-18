import { action, makeAutoObservable } from "mobx";

// Class for the popup store
class SheetStore {
  // Observable property for the popup message
  isMenuSheetActive: boolean = false;
  isCartSheetActive: boolean = false;
  isCartCustomerFormActive: boolean = false;

  // Constructor for the SheetStore class
  constructor() {
    makeAutoObservable(this, {
      toggleMenuSheetActive: action,
      toggleCartSheetActive: action,
      toggleCartCustomerFormActive: action,
    });
  }

  toggleMenuSheetActive() {
    this.isMenuSheetActive = !this.isMenuSheetActive;
  }

  toggleCartSheetActive() {
    this.isCartSheetActive = !this.isCartSheetActive;
  }

  toggleCartCustomerFormActive() {
    this.isCartCustomerFormActive = !this.isCartCustomerFormActive;
  }
}

export default new SheetStore();
