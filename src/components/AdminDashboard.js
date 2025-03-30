import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    imageUrl: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  //  Only for sending to backend
  const formatImageUrl = (imageUrl) => {
    const basePath = "/images/";

    if (!imageUrl) return ""; // If empty, store empty string (or null if you prefer)

    // Avoid double path
    if (imageUrl.startsWith(basePath)) return imageUrl;

    return `${basePath}${imageUrl}`;
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSelectProduct = (product) => {
    const cleanedImageUrl = product.imageUrl
      ? //  chatGPT för att jag kan inte regex
        product.imageUrl.replace(/^http:\/\/localhost:3001\/images\//, "")
      : "";

    setSelectedProduct(product);
    setProductData({ ...product, imageUrl: cleanedImageUrl });
  };

  const handleCreateProduct = async () => {
    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          imageUrl: formatImageUrl(productData.imageUrl),
        }),
      });

      if (!response.ok) throw new Error("Failed to create product");

      fetchProducts();
      setProductData({
        title: "",
        description: "",
        price: "",
        stock_quantity: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error creating product: ", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `http://localhost:3001/products/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...productData,
            imageUrl: formatImageUrl(productData.imageUrl),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update product");
      fetchProducts();
      setProductData({
        title: "",
        description: "",
        price: "",
        stock_quantity: "",
        imageUrl: "",
      });
      setSelectedProduct(null);
      // Reset the form after update
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      fetchProducts();
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(null);
        setProductData({
          title: "",
          description: "",
          price: "",
          stock_quantity: "",
          imageUrl: "",
        });
      }
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Formulär för att skapa ny produkt */}
      <div className="grid gap-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {selectedProduct ? "Update product" : "Add product"}
        </h2>
        <input
          type="text"
          name="title"
          placeholder="Product name"
          value={productData.title}
          onChange={handleChange}
          className="border p-2 w-full mr-2"
        />
        <textarea
          type="text"
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleChange}
          className="border p-2 w-full mb-2 h-24"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
          className="border p-2 w-full mr-2"
        />
        <input
          type="number"
          name="stock_quantity"
          placeholder="Stock quantity"
          value={productData.stock_quantity}
          onChange={handleChange}
          className="border p-2 w-full mr-2"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL (rose.jpg)"
          value={productData.imageUrl}
          onChange={handleChange}
          className="border p-2 w-full mr-2"
        />
        <button
          onClick={selectedProduct ? handleUpdateProduct : handleCreateProduct}
          className={`w-full p-2 rounded ${
            selectedProduct ? "bg-yellow-500" : "bg-blue-500"
          } text-white`}
        >
          {selectedProduct ? "Update" : "Add"}
        </button>
        <button
          onClick={() => {
            setProductData({
              title: "",
              description: "",
              price: "",
              stock_quantity: "",
              imageUrl: "",
            });
            setSelectedProduct(null);
          }}
          className="p-2 w-full mt-2 bg-gray-500 text-white rounded"
        >
          Clear
        </button>
      </div>

      {/* Lista över befintliga produkter */}
      <h2 className="text-xl font-semibold mb-2">Products</h2>
      <ul>
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-4 mb-2 flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectProduct(product)}
          >
            <div>
              <strong>{product.title}</strong> - {product.description} -{" "}
              {product.price}$ - Stock: {product.stock_quantity}
              <img
                src={product.imageUrl}
                alt="preview"
                className="w-32 h-32 object-cover"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent it from clicking on the product
                handleDeleteProduct(product.id);
              }}
              className="bg-red-500 text-white p-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Knapp för att gå tillbaka till hemsidan */}
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-gray-600 text-white p-2 rounded"
      >
        Back to shop
      </button>
    </div>
  );
};

export default AdminDashboard;
