import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  applyForJob,
  chnageStatus,
  getApplicants,
  getAppliedJobs,
} from "../controllers/application.controller.js";
const router = express.Router();
router.post("/apply/:jobId", isAuthenticated, applyForJob);
router.get("/get", isAuthenticated, getAppliedJobs);
router.get("/get-applicants/:jobId", isAuthenticated, getApplicants);
router.put("/status/:applicationId", isAuthenticated, chnageStatus);
export default router;
