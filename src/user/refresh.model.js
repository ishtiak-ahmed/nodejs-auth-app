const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const refreshSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    }
  }
);

module.exports = mongoose.model('Refresh', refreshSchema);
