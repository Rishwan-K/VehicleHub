const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedToken; // { userId, role }
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Token Invalid" });
  }
};

module.exports = authMiddleware;
