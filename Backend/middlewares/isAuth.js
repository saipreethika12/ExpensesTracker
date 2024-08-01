const jwt = require("jsonwebtoken");
const isAuthenticated = async (req, res, next) => {
  //console.log(req.headers);
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];
  //console.log(token);
  const verifytoken = jwt.verify(token, "mykey", (err, decoded) => {
    console.log(decoded);
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
  console.log(verifytoken);
  if (verifytoken) {
    req.user = verifytoken.id;
  } else {
    const err = new Error("Token expired,login again");
    next(err);
  }
  next();
};
module.exports = isAuthenticated;
