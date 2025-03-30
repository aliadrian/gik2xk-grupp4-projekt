import React from "react";
import CartItems from "./CartItems";

const CartSidebar = ({
  user,
  cartOpen,
  cartItems,
  setCartItems,
  setCartOpen,
  refreshCart,
}) => {
  return (
    <div
      className={`fixed right-0 top-0 w-full max-w-xs h-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300 z-20 ${
        cartOpen ? "translate-x-0 ease-out" : "translate-x-full ease-in"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium text-gray-700">Your cart</h3>
        <button
          onClick={() => setCartOpen(!cartOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <CartItems
        user={user}
        cartOpen={cartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        refreshCart={refreshCart}
      />
    </div>
  );
};

export default CartSidebar;
