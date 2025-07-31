import dotenv from "dotenv";
dotenv.config();


import jwt from "jsonwebtoken";
const SECRET =process.env.JWT_SECRET; // add secret to .env
function createTokenForUser(user) {
  const payload = {
    name: user.name,
    _id: user._id,
    email: user.email,
    profilePicture: user.profilePicture,
    createdAt:user.createdAt,
  };

  const token = jwt.sign(payload, SECRET, { expiresIn: "24h" });
  // console.log(token);
  return token;
}

function validateToken(token) {
  try {
    const payload = jwt.verify(token, SECRET);
    return payload;
  } catch (err) {
  
    return null; 
  }
}

export { createTokenForUser, validateToken };
