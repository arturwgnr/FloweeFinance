import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log("HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "⛔ Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({
      message: "⛔ Invalid or expired token",
      error: error.message,
    });
  }
}
