import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import { v2 as cloudinary } from "cloudinary";
// signup user
export const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;
    const file = req.file;
    console.log(file);
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    if (!name || !email || !password || !phoneNumber || !role) {
      res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        message: "user already exists with this email",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashPassword,
      phoneNumber,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });
    await user.save();
    res.status(201).json({
      message: "user created successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("error in sinup", error);
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: "user not found",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        message: "invalid credentials",
        success: false,
      });
    }
    if (role !== user.role) {
      res.status(400).json({
        message: "invalid Role",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phoneNumber: user.phoneNumber,
      skills: user.profile?.skills,
      bio: user.profile?.bio,
      profile: user.profile?.profilePhoto,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 86400000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `welcome ${user.name}`,
        success: true,
        user,
        token,
      });
  } catch (error) {
    console.log("error in login", error);
  }
};

// logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "logout successfully",
      success: true,
    });
  } catch (error) {
    console.log("error in logout", error);
  }
};

// update profile

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    let skillsArray = [];
    if (skills) skillsArray = skills.split(",");
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        message: "user not found",
        success: false,
      });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeName = file.originalname;
    }
    await user.save();
    res.status(200).json({
      message: "profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("error in updating", error);
  }
};
