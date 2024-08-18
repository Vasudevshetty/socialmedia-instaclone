const mongoose = require("mongoose");

module.exports = connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb connected successfully\n");
  } catch (error) {
    console.log(error);
  }
};
