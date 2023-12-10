import { createContext, useContext } from "react";

import RootStore from "./root-store";

// creating context
export const RootStoreContext = createContext<RootStore | null>(null);

// returning context if context exists
export const useStore = () => {
  const context = useContext(RootStoreContext);
  if (context === null) throw new Error("There is error within state manager");
  return context;
};
