const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      status: 401,
      message: "Access denied, No token provided.",
      data: null,
    });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 401,
      message: "Token format invalid",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isApprove) {
      return res.status(401).json({
        status: 401,
        message: "User not approved. Please contact admin.",
        data: null,
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: "Invalid or expired token",
      data: null,
    });
  }
}

module.exports = verifyToken;
