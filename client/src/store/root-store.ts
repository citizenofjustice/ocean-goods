import cartStore from "./cartStore";

// root store class for uniting all stores for convenience
class RootStore {
  cart = cartStore;
}

export default RootStore;
