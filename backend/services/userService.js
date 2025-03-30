const User = require("../models/User");

const createUser = async (data) => {
  return await User.create(data);
};

const getAllUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const updateUser = async (id, data) => {
  return await User.update(data, { where: { id } });
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
