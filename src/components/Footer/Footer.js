import React from "react";

const Footer = () => {
  return (
    <div>
      {" "}
      <footer className="bg-gray-200 w-full mt-auto">
        <div className="mx-auto px-6 py-3 flex justify-between items-center">
          <a
            href="#"
            className="text-xl font-bold text-gray-500 hover:text-gray-400"
          >
            Flowers
          </a>
          <p className="py-2 text-gray-500 sm:py-0">All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
