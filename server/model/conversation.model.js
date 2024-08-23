const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "There has to be a participant to converse"],
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
}, {timestamps: true});

const conversation = mongoose.model("Conversation", conversationSchema);

module.exports = conversation;
