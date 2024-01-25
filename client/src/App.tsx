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
import Priveleges from "./components/Priveleges";
import RegisterForm from "./components/RegisterForm";
import Unauthorized from "./components/Pages/Unauthorized";
import RequireAuth from "./components/RequireAuth";

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
                {/* public routes */}
                <Route index element={<CatalogPage />} />
                <Route path="auth" element={<AuthPage />} />
                <Route path="item/:id" element={<ItemPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="unauthorized" element={<Unauthorized />} />

                {/* protected routes */}
                <Route path="dashboard" element={<DashboardPage />}>
                  <Route element={<RequireAuth allowedRoles={[19, 20]} />}>
                    <Route
                      path="product-types"
                      element={<ProductTypesList />}
                    />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[19]} />}>
                    <Route path="roles" element={<Roles />} />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[19]} />}>
                    <Route path="priveleges" element={<Priveleges />} />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[19]} />}>
                    <Route path="register-user" element={<RegisterForm />} />
                  </Route>
                </Route>
                <Route element={<RequireAuth allowedRoles={[19, 20]} />}>
                  <Route path="new-item" element={<AddToCatalogPage />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={[19, 20]} />}>
                  <Route
                    path="edit-item/:id"
                    element={<EditCatalogItemPage />}
                  />
                </Route>

                {/* no route matched */}
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
