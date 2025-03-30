import React, { useContext } from "react";
import CartContext from "../../context/CartContext";

const Product = ({
  updateQuantity,
  cartItems,
  setCartItems,
  user,
  loading,
}) => {
  const { isMaxStock } = useContext(CartContext);

  const handleUpdateQuantity = async (product, newAmount) => {
    if (!product || !product.product_id) {
      console.error("Error: product is undefined or missing product_id!");
      console.log("Cart Items:", cartItems);
      return;
    }

    console.log(
      `Updating quantity htmlFor product ${product.product_id} to ${newAmount}`
    );

    if (newAmount < 1) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== product.product_id)
      );
    }

    try {
      const result = await updateQuantity(user, product.product_id, newAmount);

      if (!result || result === null || !result.product_id) {
        // Properly handle null responses
        console.error("Failed to update quantity!");
        return;
      }

      if (result.removed) {
        console.log(`Removed product ${product.product_id} from cart`);
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.product_id !== product.product_id)
        );
      } else {
        console.log(
          `Updated product ${product.product_id} to quantity ${result.quantity}`
        );

        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product_id === result.product_id
              ? { ...item, quantity: result.quantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // const isMaxStock = (product) => product.quantity >= product.stock_quantity;

  return (
    <>
      <div className="flex flex-col justify-start items-start w-full xl:space-y-8 px-4 pt-8 gap-4 h-full">
        <p className="text-xl font-medium">Order Summary</p>
        <p className="text-gray-400">
          Check your items and adjust the quantity to buy more flowers 😉
        </p>
        {loading && <p>Loading cart...</p>}
        {!loading && cartItems.length === 0 && <p>Your cart is empty.</p>}
        {cartItems.map((item) => (
          <div
            key={item.product_id}
            className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full rounded-lg"
          >
            <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
              <div className="w-full md:w-40">
                <img
                  className="w-full hidden md:block"
                  src={item.imageUrl}
                  alt={item.product_name}
                />
                <img
                  className="w-full md:hidden"
                  src={item.imageUrl}
                  alt={item.product_name}
                />
              </div>
              <div className="flex-col flex items-start w-full space-y-4 md:space-y-0">
                <div className="w-full flex flex-col justify-start items-start space-y-2">
                  <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
                    {item.product_name}
                  </h3>
                  <div className="flex justify-start items-start flex-col space-y-4">
                    <p className="text-sm dark:text-white leading-none text-gray-800">
                      <span className="text-gray-500">Description: </span>
                      {item.product_description}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between space-x-8 items-start w-full items-center">
                  <p className="text-base dark:text-white xl:text-lg leading-6">
                    ${item.price}
                  </p>

                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleUpdateQuantity({ ...item }, item.quantity - 1)
                      }
                      className="text-gray-500 focus:outline-none focus:text-gray-600"
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
                      onClick={() =>
                        handleUpdateQuantity({ ...item }, item.quantity + 1)
                      }
                      disabled={isMaxStock(item)}
                      className="text-gray-500 focus:outline-none focus:text-gray-600"
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

                  <p className="text-lg font-bold dark:text-white xl:text-lg leading-6 text-gray-800">
                    ${item.price * item.quantity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Product;
