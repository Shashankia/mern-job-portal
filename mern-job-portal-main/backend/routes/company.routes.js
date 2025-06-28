import express from "express";
import {
  registerCompany,
  singleCompany,
  updateCompany,
  userCompanies,
} from "../controllers/company.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
const router = express.Router();
router.post("/register", isAuthenticated, registerCompany);
router.get("/companies", isAuthenticated, userCompanies);
router.get("/single-company/:id", isAuthenticated, singleCompany);
router.put("/update/:id", isAuthenticated, singleUpload, updateCompany);
export default router;
