const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  //Check if jwt exists
  if (token) {
    jwt.verify(
      token,
      "This is a secret string to hash with",
      (err, decodedToken) => {
        if (err) {
          res.redirect("/login");
          console.log(err.message);
        } else {
          console.log(decodedToken);
          next();
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};

module.exports = { requireAuth };
