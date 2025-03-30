const { capitalize } = require("@mui/material");
const Cart = require("../models/Cart");
const CartRow = require("../models/CartRow");
const Product = require("../models/Product");
const { deleteProduct } = require("./productService");

const createCart = async (data) => {
  return await Cart.create(data);
};

const getLatestCart = async (userId) => {
  const cart = await Cart.findOne({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: CartRow,
        include: [Product],
      },
    ],
  });
  if (!cart) return [];

  return cart.CartRows.map((cartRow) => ({
    product_id: cartRow.product_id,
    product_name: cartRow.Product.title,
    product_description: cartRow.Product.description,
    quantity: cartRow.amount,
    price: cartRow.Product.price,
    imageUrl: `http://localhost:3001${cartRow.Product.imageUrl}`,
  }));
};

const addProductToCart = async (userId, productId, amount) => {
  try {
    if (!userId) {
      return { product_id: productId, amount };
    }

    let cart = await Cart.findOne({
      where: { user_id: userId, payed: false },
    });

    if (!cart) {
      console.log(`Creating new cart for user ${userId}`);
      cart = await Cart.create({ user_id: userId, payed: false });
    }

    let cartRow = await CartRow.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (cartRow) {
      const product = await Product.findByPk(productId);
      const newAmount = cartRow.amount + amount;

      if (newAmount > product.stock_quantity) {
        throw new Error(
          `Not enough stock. Available: ${stock_quantity}, requested ${newAmount}`
        );
      }
      cartRow.amount = newAmount;
      await cartRow.save();
      console.log(`Updated amount in cart row:`, cartRow.amount);
    } else {
      cartRow = await CartRow.create({
        cart_id: cart.id,
        product_id: productId,
        amount: amount,
      });
      console.log(`Added new product to cart:`, cartRow);
    }

    return cartRow;
  } catch (error) {
    console.error("Error in addProductToCart:", error);
    throw new Error("Could not add product to cart");
  }
};

const updateCartQuantity = async (userId, productId, amount) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: userId, payed: false },
    });

    if (!cart) {
      console.error("No active cart found for user:", userId);
      return null;
    }

    let cartRow = await CartRow.findOne({
      where: { cart_id: cart.id, product_id: productId },
      include: [Product],
    });

    if (!cartRow) {
      console.error("Product not found in cart:", { userId, productId });
      return null;
    }

    if (amount < 1) {
      console.log("Removing product from cart:", { userId, productId });
      await cartRow.destroy();

      // Check if cart is empty and remove it
      const remainingItems = await CartRow.findAll({
        where: { cart_id: cart.id },
      });

      if (remainingItems.length === 0) {
        await cart.destroy();
        console.log("Cart fully removed for user:", userId);
      }

      return { product_id: productId, removed: true }; // Indicate removal
    } else {
      cartRow.amount = amount;
      await cartRow.save();
      console.log("Updated product :", {
        userId,
        productId,
        amount,
      });

      return {
        product_id: cartRow.product_id,
        product_name: cartRow.Product.title,
        quantity: cartRow.amount,
        price: cartRow.Product.price,
        imageUrl: `http://localhost:3001${cartRow.Product.imageUrl}`,
      };
    }
  } catch (error) {
    console.error("Error updating cart quantity: ", error);
    throw new Error("Failed to update quantity");
  }
};

const checkoutCart = async (userId, cartItems) => {
  console.log("Starting checkout for user:", userId);
  console.log("Cart Items:", cartItems);

  if (!userId || !cartItems.length) {
    throw new Error("Invalid checkout request");
  }

  try {
    for (const item of cartItems) {
      console.log(`Checking stock for product ID ${item.product_id}`);

      const product = await Product.findByPk(item.product_id);

      if (!product) {
        console.error(`Product ID ${item.product_id} not found`);
        throw new Error(`Product ID ${item.product_id} not found`);
      }

      console.log(
        `Product found: ${product.title}, Stock: ${product.stock_quantity}`
      );

      if (product.stock_quantity < item.quantity) {
        console.error(`Not enough stock for ${product.title}`);
        throw new Error(`Not enough stock for ${product.title}`);
      }

      console.log(`Reducing stock for ${product.title} by ${item.quantity}`);
      await product.decrement("stock_quantity", { by: item.quantity });
      // await product.reload();

      // if (product.stock_quantity <= 0) {
      //   console.log(
      //     `${product.title} is not anymore in stock, deleting product`
      //   );
      // }
      // await deleteProduct(product.id);
    }

    const cart = await Cart.findOne({
      where: { user_id: userId, payed: false },
    });

    if (cart) {
      console.log(`Clearing cart for user ${userId} (Cart ID: ${cart.id})`);
      await CartRow.destroy({ where: { cart_id: cart.id } });
      await cart.update({ payed: true });
    }

    console.log("Checkout successful!");
    return { message: "Checkout successfull!" };
  } catch (error) {
    console.error("Error during checkout: ", error);
    throw error;
  }
};

module.exports = {
  createCart,
  getLatestCart,
  addProductToCart,
  updateCartQuantity,
  checkoutCart,
};
