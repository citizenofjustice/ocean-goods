import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import RootStore from "./store/root-store";
import { RootStoreContext } from "./store/root-store-context";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import Layout from "./components/Layouts/Layout";

// lazy loaded components
const Roles = lazy(() => import("./components/Roles"));
const OrdersList = lazy(() => import("./components/OrdersList"));
const Priveleges = lazy(() => import("./components/Priveleges"));
const AuthPage = lazy(() => import("./components/Pages/AuthPage"));
const RequireAuth = lazy(() => import("./components/RequireAuth"));
const PersistAuth = lazy(() => import("./components/PersistAuth"));
const ItemPage = lazy(() => import("./components/Pages/ItemPage"));
const OrderPage = lazy(() => import("./components/Pages/OrderPage"));
const RegisterForm = lazy(() => import("./components/RegisterForm"));
const SearchPage = lazy(() => import("./components/Pages/SearchPage"));
const ContactPage = lazy(() => import("./components/Pages/ContactPage"));
const Unauthorized = lazy(() => import("./components/Pages/Unauthorized"));
const CatalogPage = lazy(() => import("./components/Pages/CatalogPage"));
const NotFoundPage = lazy(() => import("./components/Pages/NotFoundPage"));
const ProductTypesList = lazy(() => import("./components/ProductTypesList"));
const DashboardPage = lazy(() => import("./components/Pages/DashboardPage"));
const AddToCatalogPage = lazy(
  () => import("./components/Pages/AddToCatalogPage")
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
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route element={<PersistAuth />}>
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
                      <Route element={<RequireAuth allowedRoles={[1, 19]} />}>
                        <Route
                          path="product-types"
                          element={<ProductTypesList />}
                        />
                      </Route>
                      <Route element={<RequireAuth allowedRoles={[1, 19]} />}>
                        <Route path="roles" element={<Roles />} />
                      </Route>
                      <Route element={<RequireAuth allowedRoles={[1, 19]} />}>
                        <Route path="priveleges" element={<Priveleges />} />
                      </Route>
                      <Route element={<RequireAuth allowedRoles={[1, 19]} />}>
                        <Route
                          path="register-user"
                          element={<RegisterForm />}
                        />
                      </Route>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[1, 19]} />}>
                      <Route path="new-item" element={<AddToCatalogPage />} />
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[1, 19]} />}>
                      <Route
                        path="edit-item/:id"
                        element={<EditCatalogItemPage />}
                      />
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[1, 19]} />}>
                      <Route path="orders" element={<OrdersList />} />
                      <Route path="orders/:id" element={<OrderPage />} />
                    </Route>

                    {/* no route matched */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </QueryClientProvider>
      </RootStoreContext.Provider>
    </div>
  );
}

export default App;
