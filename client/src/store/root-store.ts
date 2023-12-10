import cartStore from "./cartStore";
import catalogStore from "./catalogStore";

// root store class for uniting all stores for convenience
class RootStore {
  catalog = catalogStore;
  cart = cartStore;
}

export default RootStore;
