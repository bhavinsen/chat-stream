const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = {
  chatMessage: {
    type: String,
  },
  privateMessage: {
    type: String,
  },
};

module.exports = mongoose.model("Chat", chatSchema);
