import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import Layout from "./components/Pages/Layout";
import ItemPage from "./components/Pages/ItemPage";
import CatalogPage from "./components/Pages/CatalogPage";
import NotFoundPage from "./components/Pages/NotFoundPage";
import SearchPage from "./components/Pages/SearchPage";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<CatalogPage />} />
              <Route path="item/:id" element={<ItemPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
