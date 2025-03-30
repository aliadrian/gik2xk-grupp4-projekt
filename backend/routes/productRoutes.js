const express = require("express");
const router = express.Router();
const productService = require("../services/productService");
const ratingService = require("../services/ratingService");
const cartService = require("../services/cartService");

router.get("/", async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    const formatImageUrl = (url) => {
      if (!url) return null;
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      return `http://localhost:3001${url}`;
    };

    const productsWithImages = products.map((product) => {
      return {
        ...product.dataValues,
        imageUrl: formatImageUrl(product.imageUrl),
      };
    });

    res.json(productsWithImages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/:id/addRating", async (req, res) => {
  try {
    const { user_id, rating } = req.body;

    if (!user_id || !rating) {
      return res.status(400).json({ error: "User ID and rating are required" });
    }

    const newRating = await ratingService.addRating({
      product_id: req.params.id,
      user_id,
      rating,
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: "Failed to add rating" });
  }
});

router.post("/:id/addToCart", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const productId = req.params.id;

    if (!userId || !amount) {
      return res.status(400).json({ error: "User ID and amount are required" });
    }

    const cartRow = await cartService.addProductToCart(
      userId,
      productId,
      amount
    );
    res.status(201).json(cartRow);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});

router.get("/:id", async (req, res) => {
  const formatImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `http://localhost:3001${url}`;
  };

  try {
    const product = await productService.getProductById(req.params.id);
    if (product) {
      product.imageUrl = formatImageUrl(product.imageUrl);
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    if (updated[0]) res.json({ message: "Product updated" });
    else res.status(404).json({ error: "Product not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (deleted) res.json({ message: "Product deleted" });
    else res.status(404).json({ error: "Product not found " });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
