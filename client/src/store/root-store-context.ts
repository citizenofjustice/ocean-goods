import { createContext, useContext } from "react";

import RootStore from "@/store/root-store";

// Creating a context for the root store
// The context is initially null
export const RootStoreContext = createContext<RootStore | null>(null);

// Hook to use the root store context
export const useStore = () => {
  // Getting the context
  const context = useContext(RootStoreContext);

  // If the context is null (which means the Provider is missing in the component tree), throw an error
  if (context === null) throw new Error("There is error within state manager");

  // Return the context (which is the root store)
  return context;
};
