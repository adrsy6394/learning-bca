import User from "../models/User.js";
import Syllabus from "../models/Syllabus.js";

// @desc    Get Admin Dashboard Stats
// @route   GET /api/v2/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalSyllabusModules = await Syllabus.countDocuments();

    // Calculate total topics across all syllabus modules
    const allSyllabus = await Syllabus.find();
    let totalTopics = 0;
    allSyllabus.forEach(module => {
      if (module.units) {
        module.units.forEach(unit => {
          if (unit.topics) {
            totalTopics += unit.topics.length;
          }
        });
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalSyllabusModules,
        totalTopics
      }
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// @desc    Get all users
// @route   GET /api/v2/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @desc    Delete user
// @route   DELETE /api/v2/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === "admin" && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "Cannot delete another admin" });
      }
      
      await User.deleteOne({ _id: user._id });
      res.json({ success: true, message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// @desc    Promote or demote user role
// @route   PUT /api/v2/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent self-demotion to avoid locking out the only admin
      if (req.user._id.toString() === user._id.toString() && role !== "admin") {
         return res.status(403).json({ message: "You cannot demote yourself" });
      }

      user.role = role;
      const updatedUser = await user.save();
      res.json({ 
        success: true, 
        user: {
          _id: updatedUser._id,
          full_name: updatedUser.full_name,
          email: updatedUser.email,
          role: updatedUser.role
        } 
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update role" });
  }
};

// @desc    Create new syllabus module
// @route   POST /api/v2/admin/syllabus
// @access  Private/Admin
export const createSyllabus = async (req, res) => {
  try {
    const newSyllabus = await Syllabus.create(req.body);
    res.status(201).json({ success: true, syllabus: newSyllabus });
  } catch (error) {
    res.status(500).json({ message: "Failed to create syllabus module" });
  }
};

// @desc    Update syllabus module
// @route   PUT /api/v2/admin/syllabus/:id
// @access  Private/Admin
export const updateSyllabus = async (req, res) => {
  try {
    const updatedSyllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (updatedSyllabus) {
      res.json({ success: true, syllabus: updatedSyllabus });
    } else {
      res.status(404).json({ message: "Syllabus module not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update syllabus module" });
  }
};

// @desc    Delete syllabus module
// @route   DELETE /api/v2/admin/syllabus/:id
// @access  Private/Admin
export const deleteSyllabus = async (req, res) => {
  try {
    const result = await Syllabus.deleteOne({ _id: req.params.id });
    
    if (result.deletedCount > 0) {
      res.json({ success: true, message: "Syllabus module deleted" });
    } else {
      res.status(404).json({ message: "Syllabus module not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete syllabus module" });
  }
};
