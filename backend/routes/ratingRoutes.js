const express = require("express");
const router = express.Router();
const ratingService = require("../services/ratingService");

router.get("/:productId", async (req, res) => {
  try {
    const ratings = await ratingService.getRatingsByProduct(
      req.params.productId
    );
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch ratings" });
  }
});

router.get("/:productId/average", async (req, res) => {
  try {
    const averageRating = await ratingService.getAverageRating(
      req.params.productId
    );
    res.json({ averageRating });
  } catch (error) {
    res.status(500).json({ error: "Coudln not calculate average rating" });
  }
});

router.get("/:productId/user/:userId", async (req, res) => {
  try {
    const userRating = await ratingService.getUserRating(
      req.params.productId,
      req.params.userId
    );

    res.json({ rating: userRating ? userRating : 0 });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch user rating" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const rating = await ratingService.addRating(req.body);
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: "Couldn not add rating" });
  }
});

module.exports = router;
