import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import { v2 as cloudinary } from "cloudinary";
// register company

export const registerCompany = async (req, res) => {
  try {
    const { name } = req.body;

    const userId = req.id;

    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({
        message: "company already exists with this name",
        success: false,
      });
    }
    const company = new Company({ name, userId });
    await company.save();
    res.status(201).json({
      message: "company created successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log("error in creating company", error);
  }
};

// loggedin user companies

export const userCompanies = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      res.status(400).json({
        message: "user not found",
        success: false,
      });
    }
    const companies = await Company.find({ userId });
    res.status(200).json({
      message: "companies fetched successfully",
      success: true,
      companies,
    });
  } catch (error) {
    console.log("error in fetching user companies", error);
  }
};

// single company
export const singleCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      res.status(404).json({
        message: "company not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "company fetched successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log("error in single company", error);
  }
};

// update comapny

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, website, location } = req.body;
    const file = req.file;
    console.log("file", file);
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;
    const updateData = { name, description, website, location, logo };
    const company = await Company.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!company) {
      res.status(404).json({
        message: "company not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "company updated successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log("error in updating company", error);
  }
};
