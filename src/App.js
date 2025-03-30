import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Products from "./components/Products/Products";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import Test from "./components/Test";
import MyCart from "./components/Cart/MyCart";
import ProductDetails from "./components/ProductDetails";
import AdminDashboard from "./components/AdminDashboard";
import ConfimationCard from "./components/PopupCard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/" element={<Products user={user} setUser={setUser} />} />
      <Route
        path="/products/:id"
        element={<ProductDetails user={user} setUser={setUser} />}
      />
      <Route path="/test" element={<Test user={user} />} />
      <Route
        path="/my-cart"
        element={<MyCart user={user} setUser={setUser} />}
      />
      <Route path="/confirm" element={<ConfimationCard />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn setUser={setUser} />} />
    </Routes>
  );
}

export default App;
