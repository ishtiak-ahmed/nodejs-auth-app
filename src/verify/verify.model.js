const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const verifySchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    generatedToken: {
      type: String,
      required: true,
    }
  }
);

module.exports = mongoose.model('Verify', verifySchema);
