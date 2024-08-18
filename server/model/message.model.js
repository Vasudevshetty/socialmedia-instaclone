const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "There has to be a sender"],
    ref: "user",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "There has to be a receiver"],
    ref: "user",
  },
  message: {
    type: String,
    required: [true, "There has to be a message to be sent"],
  },
});

const Message = mongoose.model(messageSchema);
module.exports = Message;
