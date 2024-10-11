import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Productpage from "./pages/ProductPage";
import Loginpage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Cartpage from "./pages/CartPage";
import PageNotFound from "./pages/PageNotFound";
import PaymentPage from "./pages/PaymentPage";
import Navbar from "./components/global/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="product/:id" element={<Productpage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/cart" element={<Cartpage />} />
            <Route path="/orders" element={<OrdersPage />} />

            <Route path="/payment" element={<PaymentPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
