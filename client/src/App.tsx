import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import RootStore from "./store/root-store";
import Layout from "./components/Layouts/Layout";
import ItemPage from "./components/Pages/ItemPage";
import SearchPage from "./components/Pages/SearchPage";
import ContactPage from "./components/Pages/ContactPage";
import CatalogPage from "./components/Pages/CatalogPage";
import NotFoundPage from "./components/Pages/NotFoundPage";
import { RootStoreContext } from "./store/root-store-context";
import AddToCatalogPage from "./components/Pages/AddToCatalogPage";
import EditCatalogItemPage from "./components/Pages/EditCatalogItemPage";
import DashboardPage from "./components/Pages/DashboardPage";
import AuthPage from "./components/Pages/AuthPage";
import ProductTypesList from "./components/ProductTypesList";
import Roles from "./components/Roles";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <RootStoreContext.Provider value={new RootStore()}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<CatalogPage />} />
                <Route path="auth" element={<AuthPage />} />
                <Route path="dashboard" element={<DashboardPage />}>
                  <Route path="product-types" element={<ProductTypesList />} />
                  <Route path="roles" element={<Roles />} />
                </Route>
                <Route path="item/:id" element={<ItemPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="new-item" element={<AddToCatalogPage />} />
                <Route path="edit-item/:id" element={<EditCatalogItemPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </RootStoreContext.Provider>
    </>
  );
}

export default App;
