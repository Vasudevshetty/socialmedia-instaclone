const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "There has to be a sender"],
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "There has to be a receiver"],
    ref: "User",
  },
  message: {
    type: String,
    required: [true, "There has to be a message to be sent"],
  },
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
