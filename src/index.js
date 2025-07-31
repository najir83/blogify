import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./router/userRouter.js";
import BlogRouter from "./router/blogRouter.js";
import checkAuthentication from "./authService/checkauth.middlewire.js";
import Blog from "./models/blog.model.js";
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

connectDB(MONGO_URL);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("./public"));
app.use(cookieParser());
app.use(checkAuthentication("token"));
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://your-production-domain.com",
  "https://another-allowed-domain.com",
  process.env.ORIGIN,
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); 
      }
    },
    credentials: true,
  })
);
app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate(
      "created_by",
      "_id name profilePicture"
    );
    return res.status(200).json({ blogs: blogs });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/blog", BlogRouter);
app.use("/user", UserRouter);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
