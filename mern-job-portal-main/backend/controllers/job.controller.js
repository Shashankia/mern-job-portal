import { Job } from "../models/job.model.js";

// ✅ Post Job (Admin Only)
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      requirements,
      location,
      experienceLevel,
      jobType,
      position,
      company,
    } = req.body;

    if (
      !title ||
      !description ||
      !salary ||
      !requirements ||
      !location ||
      !experienceLevel ||
      !jobType ||
      !position
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // 🔄 Salary: "67k" => 67000 or "60,000" => 60000
    let processedSalary = salary;
    if (processedSalary.toLowerCase().includes('k')) {
      processedSalary = parseInt(processedSalary.replace(/k/gi, '').trim()) * 1000;
    } else {
      processedSalary = parseInt(processedSalary.replace(/,/g, '').trim());
    }

    // 🔄 Experience: "5 years" => 5
    let processedExperienceLevel = experienceLevel;
    if (processedExperienceLevel.toLowerCase().includes('year')) {
      processedExperienceLevel = parseInt(processedExperienceLevel.replace(/[^0-9]/g, '').trim());
    }

    const userId = req.id;
    const job = new Job({
      title,
      description,
      salary: processedSalary,
      requirements: requirements.split(","),
      location,
      experienceLevel: processedExperienceLevel,
      jobType,
      position: Number(position),
      company,
      created_by: userId,
    });

    await job.save();
    res.status(201).json({
      message: "Job created successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log("Error in post job", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ✅ Get All Jobs (with search)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Jobs fetched successfully",
      success: true,
      jobs,
    });
  } catch (error) {
    console.log("Error in get all jobs", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ✅ Get Single Job (with application + company populated)
export const getSingleJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate([
      { path: "application" },
      { path: "company" },
    ]);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Job fetched successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log("Error in get single job", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ✅ Get Jobs Posted by Admin
export const adminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate("company");

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Jobs fetched successfully",
      success: true,
      jobs,
    });
  } catch (error) {
    console.log("Error in get admin jobs", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
