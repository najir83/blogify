import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "node:crypto";
import { createTokenForUser } from "./users.jwt.js";
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String },
    profilePicture: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    varificationTokan: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  // console.log(this.password)
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

//static virtual function
userSchema.static(
  "matchPasswordAndAuthenticate",
  async function (email, password) {
      const user = await this.findOne({ email });
      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      const salt = user.salt;
      const hashedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
      if (hashedPassword !== user.password) {
     
        const err = new Error("Incorrect password");
        err.statusCode = 401;
        throw err;
      }
      const token = createTokenForUser(user);
      return token;
    
  }
);

const User = model("user", userSchema);
export default User;
