import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
const router = express.Router();
router.post("/signup", singleUpload, signup);
router.post("/signin", login);
router.get("/logout", isAuthenticated, logout);
router.put("/update", isAuthenticated, singleUpload, updateProfile);

export default router;