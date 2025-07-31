import express from "express";
import User from "../authService/users.model.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { createTokenForUser } from "../authService/users.jwt.js";

const UserRouter = express.Router();
UserRouter.get("/", (req, res) => {
  return res.status(200).json({ user: req.user });
});
UserRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exits" });
  }

  try {
    await User.create({
      name,
      email,
      password,
    });
    return res.status(201).json({ message: "Signup successful" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});
UserRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndAuthenticate(email, password);
    if (!token) {
      return res.status(400).json({ message: "Invalid cradentials" });
    }
    return res
      .cookie("token", token, {
        httpOnly: true, // Prevents JS access (XSS protection)
        sameSite: "None", // allows cross-origin
        secure: true, // required for sameSite=None to work on HTTPS (Render)

        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .json({ message: "Login Successful" });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ message: e.message || "Internal Server Error" });
  }
});
UserRouter.post("/updatepassword", async (req, res) => {
  const { name, email, password } = req.body;
  // console.log(name, email, password);
  try {
    const user = await User.findOne({ name, email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = password;
    await user.save();

    return res.status(200).json({ message: "update successful" });
  } catch (e) {
    return res.status(404).json({ message: "user not found" });
  }
});

const upload = multer({ dest: "./public/uploads/" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRATE,
});

UserRouter.post(
  "/update-profile",
  upload.single("profile_pic"),
  async (req, res) => {
    // console.log(req.user);
    if (!req.file) {
      return res.status(404).json({ message: "File not found" });
    }

    try {
      const user = await User.findById(req.user?._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const responce = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogImages",
      });
      fs.unlinkSync(req.file.path);
      
      user.profilePicture = responce.secure_url;
      
      user.save();
      const token = createTokenForUser(user);
      res.cookie("token", token, {
        httpOnly: true, // Prevents JS access (XSS protection)
        sameSite: "None", // allows cross-origin
        secure: true, // required for sameSite=None to work on HTTPS (Render)

        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res
        .status(200)
        .json({ message: "update successful", newUrl: responce.secure_url });
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

UserRouter.post("/logout", (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .status(200)
    .json({ message: "logout successful" });
});

export default UserRouter;
