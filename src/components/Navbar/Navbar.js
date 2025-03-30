import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import CartContext from "../../context/CartContext";
import UserMenu from "./UserMenu";
import CartSidebar from "./CartSidebar";

const Navbar = ({ user, setUser }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const { cart } = useContext(CartContext);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Cart", path: "/my-cart" },
    // { name: "Categories", path: "/" },
    // { name: "Contact", path: "/" },
    // { name: "About", path: "/" },
  ];

  const refreshCart = () => {
    if (user) {
      fetch(`http://localhost:3001/carts/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error || data.length === 0) {
            console.log("No items in cart, clearing UI");
            setCartItems([]);
          } else {
            setCartItems(data);
          }
        })
        .catch((error) => console.error("Error fetching cart: ", error));
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const totalCartItems = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <>
      <header>
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Sign In / Sign Out */}
            <UserMenu user={user} setUser={setUser} />
            {/* Logo */}
            <div className="text-gray-700 text-2xl font-semibold">Flowers</div>
            {/* Cart & Mobile Menu */}
            <div className="flex items-center justify-end gap-6">
              {/* Cart Icon */}
              <button
                className="relative py-2 group"
                onClick={() => setCartOpen(!cartOpen)}
              >
                <div className="t-0 absolute left-4 bottom-4 hover:cursor-pointer">
                  <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white hover:cursor-pointer">
                    {totalCartItems}
                  </p>
                </div>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-500 focus:outline-none sm:hidden"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav
            className={`${
              isOpen ? "" : "hidden"
            } sm:flex sm:justify-center sm:items-center mt-4`}
          >
            <div className="flex flex-col sm:flex-row">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="mt-3 text-gray-600 hover:underline sm:mx-3"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar
        user={user}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        refreshCart={refreshCart}
      />

      <hr className="my-3" />
    </>
  );
};

export default Navbar;
