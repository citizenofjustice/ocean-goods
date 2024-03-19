// Importing stores
import AuthStore from "@/store/AuthStore";
import CartStore from "@/store/CartStore";
import CatalogStore from "@/store/CatalogStore";
import PopupStore from "@/store/PopupStore";
import SheetStore from "@/store/SheetStore";

// root store class for uniting all stores for convenience
class RootStore {
  auth = AuthStore;
  cart = CartStore;
  catalog = CatalogStore;
  alert = PopupStore;
  sheet = SheetStore;

  constructor() {
    // Error handling: Check if all stores are defined
    if (
      !this.auth ||
      !this.cart ||
      !this.catalog ||
      !this.alert ||
      !this.sheet
    ) {
      throw new Error("One or more stores are undefined");
    }
  }
}

// Exporting an instance of the RootStore class as default
export default RootStore;
