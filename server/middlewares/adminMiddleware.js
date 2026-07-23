// Use AFTER authMiddleware on any route that only admins should hit.
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).send({ success: false, message: "Admins only" });
  }
  next();
};

module.exports = adminMiddleware;
