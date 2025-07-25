import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import ProductProvider from "~contexts/ProductContext.jsx";
import SidebarProvider from "~contexts/SidebarContext.jsx";
import CartProvider from "~contexts/CartContext.jsx";
import AuthProvider from "~contexts/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SidebarProvider>
      <CartProvider>
        <ProductProvider>
          <React.StrictMode>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </React.StrictMode>
        </ProductProvider>
      </CartProvider>
    </SidebarProvider>
  </AuthProvider>
);
