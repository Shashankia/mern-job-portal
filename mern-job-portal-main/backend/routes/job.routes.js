import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  adminJobs,
  getAllJobs,
  getSingleJob,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/post", isAuthenticated, postJob);
router.get("/get", isAuthenticated, getAllJobs);
router.get("/get-single/:id", isAuthenticated, getSingleJob);
router.get("/get-admin-jobs", isAuthenticated, adminJobs);

export default router;
