import React, { createContext, useState, useEffect } from "react";

// ChatGPT

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("guestCart"));
    if (savedCart) setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("guestCart", JSON.stringify(cart));
  }, [cart]);

  const refreshCart = async (userId, setCartItems) => {
    try {
      const res = await fetch(`http://localhost:3001/carts/${userId}`);
      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error refreshing cart: ", error);
    }
  };

  // Add to Cart Function
  const handleAddToCart = async (user, product, amount = 1) => {
    console.log("Cart before adding product:", cart);

    if (!user) {
      console.log("Adding to guest cart:", product);

      const newCart = [...cart];
      const existingItem = newCart.find((item) => item.id === product.id);
      const newAmount = existingItem ? existingItem.amount + amount : amount;

      if (existingItem) {
        existingItem.amount += amount;
      } else {
        newCart.push({ ...product, amount });
      }

      setCart(newCart);
      localStorage.setItem("guestCart", JSON.stringify(newCart));

      console.log("Cart after adding guest product:", newCart);
      return;
    }

    if (!user.id) {
      console.error("Error: user is undefined when adding to cart!");
      return;
    }

    try {
      console.log("Adding to user cart:", {
        userId: user.id,
        productId: product.id,
      });

      const response = await fetch("http://localhost:3001/carts/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to cart!");
      }

      const updatedCartRow = await response.json();
      console.log("Add to Cart Response:", updatedCartRow);

      // Fetch the updated cart to make sure it's correct
      await refreshCart(user.id, setCart);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      console.warn(
        `Cannot exceed stock limit. Max available: ${product.stock_quantity}`
      );
    }
  };

  const updateQuantity = async (user, productId, newAmount) => {
    if (!user || !user.id) {
      console.error("Error: user is undefined when updating quantity!");
      return null; // Return null instead of undefined
    }

    try {
      const stockResponse = await fetch(
        `http://localhost:3001/products/${productId}`
      );
      const product = await stockResponse.json();

      if (!product || !product.stock_quantity) {
        console.error("Could not fetch stock quantity!");
        return null;
      }

      if (newAmount > product.stock_quantity) {
        console.warn(
          `Cannot exceed stock limit. Max available: ${product.stock_quantity}`
        );
        return null;
      }

      console.log("Sending update request:", {
        userId: user.id,
        productId,
        amount: newAmount,
      });

      const response = await fetch(
        `http://localhost:3001/carts/${user.id}/cart/updateQuantity`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            productId,
            amount: newAmount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const updatedItem = await response.json();
      console.log("Quantity updated:", updatedItem);

      if (!updatedItem || !updatedItem.product_id) {
        console.error("Backend response is missing expected data!");
        return null; // Ensure we return null if data is incorrect
      }

      await refreshCart(user.id, setCart);
      return updatedItem || null; // Return the actual updated item
    } catch (error) {
      console.error("Error updating quantity:", error);
      return null; // Return null on failure
    }
  };

  const isMaxStock = (product) => product.quantity >= product.stock_quantity;

  // Clear Cart Function
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("guestCart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        handleAddToCart,
        updateQuantity,
        clearCart,
        isMaxStock,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
