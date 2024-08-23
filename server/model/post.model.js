const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    image: { type: String, required: [true, "Need something to post right!"] },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Someone has to post right"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
