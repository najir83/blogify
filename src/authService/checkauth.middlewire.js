import { validateToken } from "./users.jwt.js";
function checkAuthentication(cookieName) {
  return (req, res, next) => {
    const value = req.cookies[cookieName];
    // console.log(value);
    if (!value) {
      req.user = null;
      return next();
    }
    try {
      const UserPayload = validateToken(value);
      // console.log(UserPayload);
      req.user = UserPayload;
      return next();
    } catch (e) {
      return next();
    }
  };
}

export default checkAuthentication;
