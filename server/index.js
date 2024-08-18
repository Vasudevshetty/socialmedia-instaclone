const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./utils/db");
const userRoute = require("./routes/user.route");

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.ENVIRONMENT === "DEV") app.use(morgan("dev"));

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

app.use("/api/v1/user", userRoute);

// app.use("*", (req, res) => {
//   return res
//     .status(404)
//     .json({ message: `Cannot find ${req.url} not found!`, erorr: true });
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on PORT ${PORT}`);
});
