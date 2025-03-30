import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CartContext from "../../../context/CartContext";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

const Product = ({ product, user }) => {
  const { handleAddToCart } = useContext(CartContext);
  const [averageRating, setAverageRating] = useState(
    parseFloat(product.average_rating) || 0
  );
  const [userRating, setUserRating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:3001/ratings/${product.id}/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setUserRating(data.rating !== undefined ? data.rating : null);
        })
        .catch((error) => {
          console.error(`Error fetching user rating:`, error);
          setUserRating(null);
        });
    }
  }, [product.id, user?.id]);

  const handleRatingChange = async (e, newValue) => {
    if (!user?.id) {
      alert("You must be logged in to rate this product.");
      return;
    }

    const ratingValue = Number(newValue);
    if (isNaN(ratingValue)) {
      console.error("Invalid rating value");
      return;
    }

    console.log(
      `Submitting rating: Product ID: ${product.id}, User ID: ${user.id}, Rating: ${ratingValue}`
    );

    try {
      // 1. Submit new or updated rating
      await fetch(`http://localhost:3001/ratings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          user_id: user.id,
          rating: ratingValue,
        }),
      });

      console.log(`Rating submitted successfully!`);

      // 2. Instantly update user's rating in UI
      setUserRating(ratingValue);

      // 3. Fetch new updated average rating for **all users**
      console.log(`Fetching updated average rating for product ${product.id}`);
      fetch(`http://localhost:3001/ratings/${product.id}/average`)
        .then((res) => res.json())
        .then((data) => {
          console.log(`Updated average rating response:`, data);
          setAverageRating(parseFloat(data.averageRating) || 0);
        })
        .catch((error) => {
          console.error("Error fetching updated average rating: ", error);
        });
    } catch (error) {
      console.error("Error submitting rating: ", error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden  hover:shadow-lg transition duration-200">
      <div
        className="flex items-end justify-end h-56 w-full bg-cover bg-bottom"
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      >
        <button
          className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500 z-10"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(user, product);
          }}
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
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </button>
      </div>
      <div className="px-5 py-3 grid relative">
        <h3 className="text-gray-700 capitalize">{product.title}</h3>
        <span className="text-gray-500">${product.price}</span>

        <div className="min-h-[14px] text-xs">
          <div className="">
            <Stack spacing={1}>
              <Rating
                name="product-rating"
                value={userRating !== null ? averageRating : userRating}
                precision={1}
                onChange={(e, newValue) => handleRatingChange(e, newValue)}
              />
            </Stack>
            <div className="mt-4 mb-2">
              <Link
                to={`/products/${product.id}`}
                className="text-gray-600 border rounded-md p-2 hover:bg-gray-200 text-sm focus:outline-none"
              >
                View product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
