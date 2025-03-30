import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserMenu = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("Logging out user...");

    if (!setUser || typeof setUser !== "function") {
      console.error("setUser is undefined or not a function!");
      return;
    }

    console.log("Logout successfull!");

    localStorage.removeItem("user");
    setUser(null);

    localStorage.removeItem("guestCart");
    setCartItems([]);

    navigate("/signin");
  };

  return (
    <>
      {/* Sign In / Sign Out */}
      <div className="md:flex md:items-center text-gray-600">
        <div className="relative" ref={dropdownRef}>
          <button
            className="text-gray-600 focus:outline-none mr-4 sm:mx-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-36 bg-white border rouned shadow-lg p-2 flex flex-col gap-2 rounded">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-500 focus:bg-slate-500 active:bg-slate-500 hover:shadow-lg transition duration-200 ease-in"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-500 focus:bg-slate-500 active:bg-slate-500 hover:shadow-lg transition duration-200 ease-in"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-500 focus:bg-slate-500 active:bg-slate-500 hover:shadow-lg transition duration-200 ease-in"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserMenu;
