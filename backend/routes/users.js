const express = require("express");
const router = express.Router();
const User = require("../src/models/User");

// Validation helper
const validateUser = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!data.email || !data.email.includes("@")) {
    errors.push("Valid email is required");
  }

  if (!data.age || data.age < 1 || data.age > 120) {
    errors.push("Age must be between 1 and 120");
  }

  if (!data.department || data.department.trim().length < 2) {
    errors.push("Department must be at least 2 characters");
  }

  if (!data.role || data.role.trim().length < 2) {
    errors.push("Role must be at least 2 characters");
  }

  return errors;
};

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { users, total: users.length } });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST create user
router.post("/", async (req, res) => {
  const errors = validateUser(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join(", ") });
  }

  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, data: user, message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PUT update user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const updates = { ...req.body, updatedAt: new Date() };
    const errors = validateUser({ ...user.toObject(), ...updates });

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(", ") });
    }

    // Check for email conflict
    if (updates.email && updates.email !== user.email) {
      const emailExists = await User.findOne({ email: updates.email });
      if (emailExists) {
        return res.status(400).json({ success: false, error: "Email already exists" });
      }
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({ success: true, data: user, message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
