const sharp = require("sharp");
const Post = require("../model/post.model");
const User = require("../model/user.model");
const Comment = require("../model/comment.model");
const cloudinary = require("../utils/cloudinary");

async function addNewPost(req, res) {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image)
      return res
        .status(400)
        .json({ message: "Image required", success: false });

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({
      path: "author",
      select: "-password",
    });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePic" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username, profilePic",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function getUserPosts(req, res) {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePic",
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePic",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function likePost(req, res) {
  try {
    const likedBy = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });

    await post.updateOne({ $addToSet: { likes: likedBy } });
    await post.save();

    // implement socket io for realtime notification
    return res.status(200).json({
      message: "Post liked",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function dislikePost(req, res) {
  try {
    const dislikedBy = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });

    await post.updateOne({ $pull: { likes: dislikedBy } });
    await post.save();

    // implement socket io for realtime notification
    return res.status(200).json({
      message: "Post disliked",
      success: false,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function addComment(req, res) {
  try {
    const postId = req.params.id;
    const commentedBy = req.id;

    const { text } = req.body;
    if (!text)
      return res
        .status(400)
        .json({ message: "Text not found to comment!", success: false });

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    let comment = await Comment.create({
      text,
      author: commentedBy,
      post: postId,
    }).populate({
      path: "author",
      select: "username profilePic",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      message: "Commented successfully",
      comment,
      success: false,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function getCommentsOfPost(req, res) {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({
      post: postId,
    }).populate({ path: "author", select: "username profilePic" });

    if (!comments)
      return res.status(404).json({
        message: "No comments for this post",
        success: false,
      });

    return res.status(200).json({
      comments,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function deletePost(req, res) {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post unavaliable to delete", success: false });

    if (post.author.toString() !== authorId)
      return res.status(403).json({
        message: "Unauthorized, only users can delete",
      });

    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ message: "Post deleted", success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function bookmarkPost(req, res) {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // remove bookmark has it is already
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "Unsaved",
        message: "Unbookmarked successfully",
        success: true,
      });
    } else {
      // add to bookmark
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "Saved",
        message: "Bookmarked successfully",
        success: true,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

module.exports = {
  addNewPost,
  getAllPosts,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  deletePost,
  getCommentsOfPost,
  bookmarkPost,
};
