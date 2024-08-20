const sharp = require("sharp");
const Post = require("../model/post.model");
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
      .populate(
        { path: "author", select: "username, profilePic" },
        {
          path: "comment",
          sort: { createdAt: -1 },
          populate: {
            path: "author",
            select: "username, profilePic",
          },
        }
      );

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
    const posts = await Post.findById(authorId)
      .sort({ createdAt: -1 })
      .populate(
        {
          path: "author",
          select: "username, profilePic",
        },
        {
          path: "comment",
          sort: { createdAt: -1 },
          populate: {
            path: "author",
            select: "username, profilePic",
          },
        }
      );
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

module.exports = {
  addNewPost,
  getAllPosts,
  getUserPosts,
};
