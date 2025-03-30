const express = require("express");
const router = express.Router();
const cartRowService = require("../services/cartRowService");

router.post("/", async (req, res) => {
  try {
    const cartRow = await cartRowService.addProductToCart(req.body);
    res.status(201).json(cartRow);
  } catch (error) {
    res.status(500).json({ error: "Could not add product to cart" });
  }
});

module.exports = router;
