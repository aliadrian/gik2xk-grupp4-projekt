const { Sequelize } = require("sequelize");
const { Product, Rating } = require("../models");

const getAllProducts = async () => {
  try {
    return await Product.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "price",
        "imageUrl",
        "stock_quantity",
        [
          Sequelize.fn(
            "IFNULL",
            Sequelize.fn("AVG", Sequelize.col("Ratings.rating")),
            0
          ),
          "average_rating",
        ],
      ],
      include: [
        {
          model: Rating,
          attributes: [], // Exclude individual ratings
        },
      ],
      group: ["Product.id"],
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const getProductById = async (id) => {
  return await Product.findByPk(id, {
    include: [{ model: Rating, attributes: ["rating"] }],
  });
};

const createProduct = async (data) => {
  return await Product.create({
    ...data,
    imageUrl: `${data.imageUrl}`,
  });
};

const updateProduct = async (id, data) => {
  return await Product.update(data, { where: { id } });
};

const deleteProduct = async (id) => {
  return await Product.destroy({ where: { id } });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
