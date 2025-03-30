import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import CartContext from "../../context/CartContext";
import PopupCard from "../PopupCard";
import PaymentDetails from "./PaymentDetails";
import Product from "./Product";

const MyCart = ({ user, setUser }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateQuantity, clearCart } = useContext(CartContext);

  useEffect(() => {
    if (!user || !user.id) return;

    setLoading(true);
    fetch(`http://localhost:3001/carts/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.error ? [] : data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setLoading(false);
      });
  }, [user]); // Only fetch when `user` changes

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    console.log("Initiating checkout process...");

    if (!cartItems.length) {
      console.warn("No items in the cart checkout!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/carts/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, cartItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete checkout");
      }

      console.log("Checkout successful!");

      setIsPopupOpen(true);
      setCartItems([]);
    } catch (error) {
      console.error("Checkout error: ", error);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setCartItems([]);
    clearCart();
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <Product
          updateQuantity={updateQuantity}
          cartItems={cartItems}
          setCartItems={setCartItems}
          user={user}
          loading={loading}
        />

        {/* Payment Details */}
        <div>
          <PaymentDetails />
          <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 mt-auto">
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                Total
              </p>
              <p className="text-2xl dark:text-gray-300 font-semibold leading-4 text-gray-600">
                ${totalPrice}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={!cartItems.length}
              className="mt-10 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
            >
              Place Order
            </button>
            <PopupCard isOpen={isPopupOpen} onClose={handleClosePopup} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCart;
