import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// apply for job

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.id;
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (alreadyApplied) {
      res.status(400).json({
        message: "Already applied for this job",
        success: false,
      });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({
        message: "job not found",
        success: false,
      });
    }

    const newApplication = new Application({ job: jobId, applicant: userId });
    await newApplication.save();
    await job.application.push(newApplication._id);
    res.status(200).json({
      message: "job applied successfuly",
      success: true,
      newApplication,
    });
  } catch (error) {
    console.log("error in apply job", error);
  }
};

// get Applied jobs

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    console.log(userId);
    const appliedJobs = await Application.find({ applicant: userId }).populate({
      path: "job",
      populate: {
        path: "company",
      },
    });
    res.status(200).json({
      message: "All applied jobs",
      success: true,
      appliedJobs,
    });
  } catch (error) {
    console.log("error in apply job", error);
  }
};

// get all applicant for job
export const getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicants = await Job.findById(jobId).populate({
      path: "application",
      populate: {
        path: "applicant",
      },
    });
    if (!applicants) {
      res.status(404).json({
        message: "No Applicants",
        success: false,
      });
    }
    res.status(200).json({
      message: "All Applicants",
      success: true,
      applicants,
    });
  } catch (error) {
    console.log("error in apply job", error);
  }
};

// change status of application

export const chnageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;
    const application = await Application.findById({ _id: applicationId });
    if (!application) {
      res.status(404).json({
        message: "application not found",
        success: false,
      });
    }
    // update the status
    application.status = status.toLowerCase();
    await application.save();
    res.status(200).json({
      message: "status changed ",
      success: true,
      application,
    });
  } catch (error) {
    console.log("error in apply job", error);
  }
};
