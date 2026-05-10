import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Auth user & get token
// @route   POST /api/v2/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        studentId: user.studentId,
        profileImage: user.profileImage,
        progress: user.progress,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/v2/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { full_name, email, studentId, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      full_name,
      email,
      studentId,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        studentId: user.studentId,
        profileImage: user.profileImage,
        progress: user.progress,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/v2/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const responseData = {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        studentId: user.studentId,
        profileImage: user.profileImage,
        progress: user.progress,
        role: user.role,
      };
      console.log("SENDING PROFILE:", responseData);
      res.json(responseData);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user progress
// @route   PUT /api/v2/auth/progress
// @access  Private
export const updateUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Deep update the progress object
      user.progress = req.body.progress || user.progress;
      
      // Explicitly tell Mongoose that the 'progress' field has changed
      user.markModified("progress");
      
      await user.save();
      // console.log("✅ Progress updated for user:", user.email);
      res.json({ message: "Progress updated successfully", progress: user.progress });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("❌ Error in updateUserProgress:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login or Register with Google
// @route   POST /api/v2/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  const { token, userInfo } = req.body;

  try {
    // Verify the access token with Google and get user info
    let googleUser = userInfo;

    if (!googleUser) {
      // Fallback: fetch user info from Google using the access token
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      googleUser = await response.json();
    }

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, name, picture } = googleUser;

    let user = await User.findOne({ email });

    if (user) {
      // User exists, log them in
      res.json({
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        studentId: user.studentId,
        profileImage: user.profileImage,
        progress: user.progress,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // User doesn't exist, create a new one
      const dummyPassword = crypto.randomBytes(16).toString("hex");
      const generatedStudentId = `G-${Date.now()}`;

      user = await User.create({
        full_name: name,
        email,
        studentId: generatedStudentId,
        password: dummyPassword,
        profileImage: picture,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          full_name: user.full_name,
          email: user.email,
          studentId: user.studentId,
          profileImage: user.profileImage,
          progress: user.progress,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
