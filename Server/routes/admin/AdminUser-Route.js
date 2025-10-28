const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUserById, editUserById } = require("../../controllers/admin/AdminUser")

// GET all users
router.get("/all", getAllUsers);

// DELETE user by ID
router.delete("/delete/:id", deleteUserById);

// PUT (edit) user by ID
router.put("/update/:id", editUserById);

module.exports = router;
