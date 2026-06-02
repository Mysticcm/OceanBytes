const User = require("../models/User");

async function createUser(username, email, salt, password) {
  return await User.create({username, email, salt, password});
}

async function getUsers() {
  return await User.find();
}

async function getUserByUserName(username) {
  return await User.findOne({username});
}

async function getUserByEmail(email) {
  return await User.findOne({email});
}



// async function deleteUser(id) {
//   return await User.findByIdAndDelete(id);
// }

module.exports = {
  createUser,
  getUsers,
  getUserByUserName,
  getUserByEmail,
  // deleteUser,
};
