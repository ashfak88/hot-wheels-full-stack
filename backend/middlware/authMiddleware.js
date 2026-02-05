const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]

  if (!token) {
    console.log("Auth failed: No token found in header", authHeader)
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    console.log("Auth failed: Invalid token", err.message)
    res.status(401).json({ message: "Token is not valid" })
  }
}

module.exports = { authMiddleware }