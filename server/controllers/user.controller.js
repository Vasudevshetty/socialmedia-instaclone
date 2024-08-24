const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const Post = require("../model/post.model");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/dataUri");
const cloudianry = require("../utils/cloudinary");

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(401).json({
        message: "Something is wrong, please check",
        success: false,
      });

    let user = await User.findOne({ email });
    if (user)
      return res.status(401).json({
        message: "Try with a different email, already user exists",
        success: false,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      user,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(401).json({
        message: "Something is wrong, please check",
        success: false,
      });

    let user = await User.findOne({ email });
    if (!user)
      res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      res.status(401).json({
        message: "Incorrect password, please check again",
        success: false,
      });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) return post;
        return null;
      })
    );
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function logout(_, res) {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePic",
        },
      }).populate("bookmarks");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function editProfile(req, res) {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePic = req.file;
    let cloudResponse;

    if (profilePic) {
      const fileUri = getDataUri(profilePic);
      cloudResponse = await cloudianry.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");

    if (!user)
      return res.status(401).json({
        message: "User not found",
        success: false,
      });

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePic) user.profilePic = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function getSuggestedUsers(req, res) {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers)
      return res.status(400).json({
        message: "Currently no users to show suggesstions",
        success: false,
      });
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function followOrUnfollow(req, res) {
  try {
    const followedBy = req.id;
    const followedTo = req.params.id;
    if (followedBy == followedTo)
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });

    const user = await User.findById(followedBy);
    const targetUser = await User.findById(followedTo);

    if (!user || !targetUser)
      return res.status(400).json({
        message: "User not found",
        success: false,
      });

    const isFollowing = user.following.includes(followedTo);
    const operation = isFollowing ? "$pull" : "$push";
    await Promise.all([
      User.updateOne(
        {
          _id: followedBy,
        },
        {
          [operation]: { following: followedTo },
        }
      ),
      User.updateOne(
        {
          _id: followedTo,
        },
        {
          [operation]: { followers: followedBy },
        }
      ),
    ]);

    return res.status(200).json({
      message: isFollowing ? "Unfollowed successfull" : "Followed successfull",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

module.exports = {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getSuggestedUsers,
  followOrUnfollow,
};
