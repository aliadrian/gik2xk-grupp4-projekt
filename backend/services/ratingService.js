const Rating = require("../models/Rating");

const getRatingsByProduct = async (productId) => {
  return await Rating.findAll({ where: { product_id: productId } });
};

const addRating = async (data) => {
  const existingRating = await Rating.findOne({
    where: { product_id: data.product_id, user_id: data.user_id },
  });

  if (existingRating) {
    existingRating.rating = data.rating;
    await existingRating.save();
    return existingRating;
  }
  return await Rating.create({
    product_id: data.product_id,
    user_id: data.user_id,
    rating: data.rating,
  });
};

const getAverageRating = async (productId) => {
  const ratings = await Rating.findAll({ where: { product_id: productId } });
  if (ratings.length === 0) return 0;

  const sum = ratings.reduce((total, rating) => total + rating.rating, 0);

  return sum / ratings.length;
};

const getUserRating = async (productId, userId) => {
  return await Rating.findOne({
    where: { product_id: productId, user_id: userId },
  });
};

module.exports = {
  getRatingsByProduct,
  addRating,
  getAverageRating,
  getUserRating,
};
