import React, { useEffect, useState } from "react";
import Product from "./Product/Product";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Products = ({ user, setUser }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products: ", error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} setUser={setUser} />

      <div className="flex-grow mb-12 px-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
          {products.map((product) => (
            <li key={product.id} className="list-none">
              <Product product={product} user={user} />{" "}
            </li>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
