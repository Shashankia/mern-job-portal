import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - Token not found",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log("error in isAuthenticated", error);
    return res.status(401).json({
      message: "Token verification failed",
      success: false,
    });
  }
};
