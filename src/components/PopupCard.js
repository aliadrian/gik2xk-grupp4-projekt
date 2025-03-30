import React, { useState } from "react";

const PopupCard = ({ isOpen, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);
  if (!isOpen) return null;
  const blur = "blur(5px)";

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50"
      style={{ backdropFilter: blur }}
    >
      <div className="w-96 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
        <svg
          className="w-12 h-12 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
          />
        </svg>

        <p className="text-xl font-bold text-black flex items-center gap-1">
          Tack för ditt köp <span>🥳</span>
        </p>

        {/* Description */}
        <p className="text-center text-gray-500 text-sm">
          Tack för att ha handlat hos oss!
        </p>

        {/* Button */}
        <button
          className="text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-150 ease-in-out"
          style={{
            backgroundColor: isHovered
              ? "oklch(0.541 0.281 293.009)"
              : "oklch(0.606 0.25 292.717)",
            boxShadow: "0 4px 6px -1px #977ef3, 0 2px 4px -1px #977ef3",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupCard;
