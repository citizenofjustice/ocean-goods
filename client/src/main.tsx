import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/index.css";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (import.meta.env.PROD) {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
