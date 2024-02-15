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
}

export default RootStore;
