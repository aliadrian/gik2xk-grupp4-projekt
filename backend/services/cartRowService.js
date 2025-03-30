const CartRow = require("../models/CartRow");

const addProductToCart = async (data) => {
  return await CartRow.create(data);
};

module.exports = { addProductToCart };
