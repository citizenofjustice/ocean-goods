// Importing stores
import AuthStore from "./authStore";
import cartStore from "./cartStore";
import catalogStore from "./catalogStore";
import popupStore from "./popupStore";

// root store class for uniting all stores for convenience
class RootStore {
  auth = AuthStore;
  cart = cartStore;
  catalog = catalogStore;
  alert = popupStore;

  constructor() {
    // Error handling: Check if all stores are defined
    if (!this.auth || !this.cart || !this.catalog || !this.alert) {
      throw new Error("One or more stores are undefined");
    }
  }
}

// Exporting an instance of the RootStore class as default
export default RootStore;
