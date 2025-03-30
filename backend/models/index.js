// ChatGPT

const Product = require("./Product");
const User = require("./User");
const Cart = require("./Cart");
const CartRow = require("./CartRow");
const Rating = require("./Rating");

// Relationships
User.hasMany(Cart, { foreignKey: "user_id", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Cart.hasMany(CartRow, { foreignKey: "cart_id", onDelete: "CASCADE" });
CartRow.belongsTo(Cart, { foreignKey: "cart_id" });

Product.hasMany(CartRow, { foreignKey: "product_id", onDelete: "CASCADE" });
CartRow.belongsTo(Product, { foreignKey: "product_id" });

Product.hasMany(Rating, { foreignKey: "product_id", onDelete: "CASCADE" });
Rating.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(Rating, { foreignKey: "user_id", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "user_id" });

module.exports = { Product, User, Cart, CartRow, Rating };
