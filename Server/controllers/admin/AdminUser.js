const User = require("../../Models/User");
const bcrypt = require("bcrypt");


// ✅ Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Only select username and email, exclude password
    const users = await User.find({}, { username: 1, email: 1, _id: 1 });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};


// ✅ Delete a user by ID (admin only)
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// ✅ Edit (update) user info (admin only)
const editUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    // Hash the password first if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        email,
        ...(hashedPassword && { password: hashedPassword }), // only update password if provided
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

module.exports = { getAllUsers, deleteUserById, editUserById };
