const User = require('./user.model');
const Refresh = require('./refresh.model');

module.exports.createUser = (userInfo) => {
  return User.create(userInfo);
};

module.exports.findUserByEmail = async(email) => {
  return (await User.findOne({ email: email })).toObject();
};
module.exports.verifyUserEmail = (email) => {
  return User.findOneAndUpdate({ email: email }, {isVerified: true}, {new: true});
};

module.exports.addToken = (token) => {
  return Refresh.create(token);
};

module.exports.findToken = (token) => {
  return Refresh.findOne({token});
};

module.exports.deleteToken = (token) => {
  return Refresh.findOneAndDelete({token});
};