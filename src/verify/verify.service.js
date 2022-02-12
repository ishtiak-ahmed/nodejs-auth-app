const Verify = require('./verify.model');

module.exports.createVerifyToken = (data) => {
  console.log(data);
  return Verify.create({...data});
};

module.exports.findByToken = (generatedToken) => {
  return Verify.findOne({ generatedToken });
};

module.exports.verifyUser = (id) => {
  return Verify.findByIdAndUpdate(id, { isVerified: true });
};
