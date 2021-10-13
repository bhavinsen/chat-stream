const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = {
  nickname: {
    type: String,
  },
};

module.exports = mongoose.model("User", userSchema);
