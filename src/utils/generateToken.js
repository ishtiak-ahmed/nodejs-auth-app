const bcrypt = require('bcryptjs');

module.exports.gereratedToken = async(email, saltRound) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(email, saltRound, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};