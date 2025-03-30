import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import CartContext from "../context/CartContext";
import Navbar from "./Navbar/Navbar";

const ProductDetails = ({ user, setUser }) => {
  const { id } = useParams();
  const { handleAddToCart, isMaxStock } = useContext(CartContext);
  const [product, setProduct] = useState({});
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/ratings/${id}/average`
        );
        const data = await response.json();
        setAverageRating(data.averageRating);
      } catch (error) {
        console.error("Error fetching average rating", error);
      }
    };

    fetchRating();
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product: ", error));
  }, [id, user]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="container mx-auto px-6 flex justify-center items-center mt-8">
        <div className="md:flex md:items-center flex-1">
          <div className="w-full h-64 md:w-1/2 lg:h-96">
            <img
              className="h-full w-full rounded-md object-cover max-w-lg mx-auto"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="w-full max-w-lg mx-auto mt-5 md:ml-8 md:mt-0 md:w-1/2">
            <h3 className="text-gray-700 uppercase text-lg">{product.title}</h3>
            <span className="text-gray-500 mt-3">${product.price}</span>
            <hr className="my-3" />

            <div className="mt-3">
              <div className="flex justify-start items-start flex-col space-y-2">
                <p className="text-md dark:text-white leading-none text-gray-800">
                  <span className="text-gray-500">Description: </span>{" "}
                  {product.description}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Stock: {product.stock_quantity}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Average rating: {averageRating}
              </p>
            </div>
            {product?.Ratings?.length === 0 ? null : (
              <div className="mt-2">
                <p className="text-md text-gray-500">Ratings</p>
                <ul className="text-sm text-gray-500">
                  {product?.Ratings?.map((ratingObj, index) => (
                    <li key={index}>
                      Rating {index + 1}: {ratingObj.rating}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center mt-6">
              <button
                className="flex gap-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents navigation on button click
                  handleAddToCart(user, product); // Pass user correctly
                }}
              >
                Add to cart
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
