const express = require("express");
const {
  register,
  logout,
  login,
  getProfile,
  getSuggestedUsers,
  followOrUnfollow,
  editProfile,
} = require("../controllers/user.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../middlewares/multer");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/:id/profile").get(isAuthenticated, getProfile);

router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePic"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);

router.route("/followorunfollow/:id").get(isAuthenticated, followOrUnfollow);

module.exports = router;
