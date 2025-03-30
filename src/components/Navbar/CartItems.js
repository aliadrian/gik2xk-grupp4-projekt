import React, { useState, useEffect, useContext } from "react";
import CartContext from "../../context/CartContext";
import { Link } from "react-router-dom";

const CartItems = ({
  user,
  cartOpen,
  cartItems,
  setCartItems,
  refreshCart,
}) => {
  cartItems = cartItems || [];
  const { cart, updateQuantity, isMaxStock } = useContext(CartContext);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/carts/${user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Cart not found");
          return res.json();
        })
        .then((data) => {
          setCartItems(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.warn("Cart fetch error:", error);
          setCartItems([]); // fallback to empty cart
        });
    }
  }, [user, cart]);

  const handleUpdateQuantity = async (product, newAmount) => {
    console.log(`Updating quantity for ${product.product_id} to ${newAmount}`);

    const result = await updateQuantity(user, product.product_id, newAmount);
    await refreshCart(); // Refresh Navbar and cart state immediately

    if (result && result.removed) {
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== product.product_id)
      );
    } else if (result) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: result.quantity }
            : item
        )
      );
    }
  };

  // const isMaxStock = (product) => product.quantity >= product.stock_quantity;

  return (
    <>
      {" "}
      {cartItems.length === 0 ? null : (
        <div className="mt-6">
          {cart.map((item) => (
            <div key={item.product_id} className="flex mb-4">
              <img
                className="h-20 w-20 object-cover rounded"
                src={item.imageUrl}
                alt={item.product_name}
              />
              <div className="mx-3">
                <h3 className="text-sm text-gray-600">{item.product_name}</h3>
                <div className="flex items-center mt-2">
                  <button
                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                    onClick={() =>
                      handleUpdateQuantity({ ...item }, item.quantity - 1)
                    }
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <span className="text-gray-700 mx-2">{item.quantity}</span>
                  <button
                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                    onClick={() =>
                      handleUpdateQuantity({ ...item }, item.quantity + 1)
                    }
                    disabled={isMaxStock(item)}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </div>
                <span className="text-gray-600">
                  {item.quantity * item.price}$
                </span>
              </div>
            </div>
          ))}
          <div className="flex">
            <Link
              to="/my-cart"
              className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-500 focus:bg-slate-500 active:bg-slate-500 hover:shadow-lg transition duration-200 ease-in"
            >
              My cart
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItems;
