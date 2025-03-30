const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const cartService = require("../services/cartService");

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userService.createUser({ email, password });
    res.status(201).json(user);
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: error.message || "Could not create user" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not sign in" });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not create user" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch users" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) res.json(user);
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch user" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateUser = await userService.updateUser(req.params.id, req.body);
    res.json(updateUser);
  } catch (error) {
    res.status(500).json({ error: "Could not update user" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (deleted) res.json({ message: "User deleted" });
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete user" });
  }
});

router.get("/:id/getCart", async (req, res) => {
  try {
    const cartItems = await cartService.getLatestCart(req.params.id);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch cart" });
  }
});

module.exports = router;
