const express = require("express");
const router = express.Router();
const cartService = require("../services/cartService");
const userService = require("../services/userService");

router.post("/", async (req, res) => {
  try {
    const cart = await cartService.createCart(req.body);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Could not create cart " });
  }
});

router.post("/addProduct", async (req, res) => {
  try {
    const { userId, productId, amount } = req.body;

    if (!productId || !amount) {
      return res
        .status(400)
        .json({ error: "Product ID, and amount are required" });
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

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await cartService.getLatestCart(userId);

    if (!cart.length) {
      return res.status(200).json([]);
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Could not fetch cart" });
  }
});

router.put("/:userId/cart/updateQuantity", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId, amount } = req.body;

    console.log("Received update request:", { userId, productId, amount });

    if (!userId || !productId || amount === undefined) {
      console.error("Missing required fields:", {
        userId,
        productId,
        amount,
      });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedCartRow = await cartService.updateCartQuantity(
      userId,
      productId,
      amount
    );

    if (!updatedCartRow) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    console.log("Updated quantity successfully:", {
      userId,
      productId,
      amount,
    });
    res.status(200).json(updatedCartRow);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Failed to update quantity" });
  }
});

router.post("/checkout", async (req, res) => {
  try {
    console.log("Received checkout request:", req.body);

    const { userId, cartItems } = req.body;

    if (!userId || !cartItems.length) {
      console.error("Invalid checkout request: Missing userId or cartItems");
      return res.status(400).json({ error: "Invalid checkout request" });
    }

    const result = await cartService.checkoutCart(userId, cartItems);

    console.log("Checkout result:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Checkout error: ", error);
    res.status(500).json({ error: error.message || "Checkout failed " });
  }
});

module.exports = router;
