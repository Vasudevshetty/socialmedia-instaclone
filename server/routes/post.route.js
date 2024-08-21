const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  addNewPost,
  getAllPosts,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  getCommentsOfPost,
  deletePost,
  bookmarkPost,
} = require("../controllers/post.controller");
const upload = require("../middlewares/multer");
const router = express.Router();

router.route("/addPost", isAuthenticated, upload.single("image"), addNewPost);
router.route("/all", isAuthenticated, getAllPosts);
router.route("/userposts/all", isAuthenticated, getUserPosts);
router.route("/:id/like", isAuthenticated, likePost);
router.route("/:id/dislike", isAuthenticated, dislikePost);
router.route("/:id/comment", isAuthenticated, addComment);
router.route("/:id/comment/all", isAuthenticated, getCommentsOfPost);
router.route("/delete/:id", isAuthenticated, deletePost);
router.route("/:id/bookmark", isAuthenticated, bookmarkPost);

module.exports = router;
