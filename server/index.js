const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [process.env.FRONTEND_URL_DEV, process.env.FRONTEND_URL],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Hello from the backend !!",
    success: true,
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on PORT ${PORT}`);
});
