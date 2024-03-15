import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import RootStore from "./store/root-store";
import { RootStoreContext } from "./store/root-store-context";
import Layout from "./components/Layouts/Layout";
import PersistAuth from "./components/PersistAuth";
import RequireAuth from "./components/RequireAuth";

// lazy loaded components
const Roles = lazy(() => import("./components/Pages/RolesPage"));
const OrdersListPage = lazy(() => import("./components/Pages/OrdersListPage"));
const PrivelegesPage = lazy(() => import("./components/Pages/PrivelegesPage"));
const AuthPage = lazy(() => import("./components/Pages/AuthPage"));
const ItemPage = lazy(() => import("./components/Pages/ItemPage"));
const OrderPage = lazy(() => import("./components/Pages/OrderPage"));
const RegisterUserPage = lazy(
  () => import("./components/Pages/RegisterUserPage")
);
const ContactPage = lazy(() => import("./components/Pages/ContactPage"));
const Unauthorized = lazy(() => import("./components/Pages/Unauthorized"));
const CatalogPage = lazy(() => import("./components/Pages/CatalogPage"));
const NotFoundPage = lazy(() => import("./components/Pages/NotFoundPage"));
const ProductTypesListPage = lazy(
  () => import("./components/Pages/ProductTypesListPage")
);
const DashboardPage = lazy(() => import("./components/Pages/DashboardPage"));
const CatalogItemFormPage = lazy(
  () => import("./components/Pages/CatalogItemFormPage")
);
const EditCatalogItemPage = lazy(
  () => import("./components/Pages/EditCatalogItemPage")
);

// Create a client and RootStore instance outside of App
const queryClient = new QueryClient();
const rootStore = new RootStore();

function App() {
  return (
    <div className="app">
      <RootStoreContext.Provider value={rootStore}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route element={<PersistAuth />}>
                <Route path="/" element={<Layout />}>
                  {/* public routes */}
                  <Route index element={<CatalogPage />} />
                  <Route path="auth" element={<AuthPage />} />
                  <Route path="item/:id" element={<ItemPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="unauthorized" element={<Unauthorized />} />

                  {/* protected routes */}
                  <Route path="dashboard" element={<DashboardPage />}>
                    <Route element={<RequireAuth allowedPriveleges={[1, 3]} />}>
                      <Route
                        path="product-types"
                        element={<ProductTypesListPage />}
                      />
                    </Route>
                    <Route element={<RequireAuth allowedPriveleges={[1, 2]} />}>
                      <Route path="roles" element={<Roles />} />
                    </Route>
                    <Route element={<RequireAuth allowedPriveleges={[1, 2]} />}>
                      <Route path="priveleges" element={<PrivelegesPage />} />
                    </Route>
                    <Route element={<RequireAuth allowedPriveleges={[1, 4]} />}>
                      <Route
                        path="register-user"
                        element={<RegisterUserPage />}
                      />
                    </Route>
                  </Route>
                  <Route element={<RequireAuth allowedPriveleges={[1, 3]} />}>
                    <Route path="new-item" element={<CatalogItemFormPage />} />
                  </Route>
                  <Route element={<RequireAuth allowedPriveleges={[1, 3]} />}>
                    <Route
                      path="edit-item/:id"
                      element={<EditCatalogItemPage />}
                    />
                  </Route>
                  <Route element={<RequireAuth allowedPriveleges={[1, 5]} />}>
                    <Route path="orders" element={<OrdersListPage />} />
                    <Route path="orders/:id" element={<OrderPage />} />
                  </Route>

                  {/* no route matched */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </RootStoreContext.Provider>
    </div>
  );
}

export default App;
