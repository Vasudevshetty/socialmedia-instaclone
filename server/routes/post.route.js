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

router
  .route("/addPost")
  .post(isAuthenticated, upload.single("image"), addNewPost);
router.route("/all").get(isAuthenticated, getAllPosts);
router.route("/userposts/all").get(isAuthenticated, getUserPosts);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all", isAuthenticated, getCommentsOfPost);
router.route("/delete/:id").get(isAuthenticated, deletePost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);

module.exports = router;
