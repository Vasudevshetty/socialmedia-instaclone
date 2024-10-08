const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Comment must have some text in it atleast"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      reqiured: [true, "Comment must be from some User"],
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      reqiured: [true, "Comment must be of some Post"],
      ref: "Post",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
