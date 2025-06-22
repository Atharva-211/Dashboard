const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Define User Schema =====
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
  department: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// ===== Express App Setup =====
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// ===== User Validation Function =====
const validateUser = (userData) => {
  const errors = [];

  if (!userData.name || userData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }
  if (!userData.email || !userData.email.includes("@")) {
    errors.push("Valid email is required");
  }
  if (!userData.age || userData.age < 1 || userData.age > 120) {
    errors.push("Age must be between 1 and 120");
  }
  if (!userData.department || userData.department.trim().length < 2) {
    errors.push("Department must be at least 2 characters long");
  }
  if (!userData.role || userData.role.trim().length < 2) {
    errors.push("Role must be at least 2 characters long");
  }

  return errors;
};

// ===== Optional Logger Middleware =====
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ===== CRUD ROUTES =====

// 🔹 Create User
app.post("/users", async (req, res) => {
  try {
    const userData = req.body;
    const errors = validateUser(userData);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(", ") });
    }

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }

    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({
    success: true,
    data: { ...newUser.toObject(), id: newUser._id },
    message: "User created successfully"
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// 🔹 Read All Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const formattedUsers = users.map((user) => ({
    ...user.toObject(),
    id: user._id,
    }));

    res.status(200).json({
    success: true,
    data: { users: formattedUsers, total: users.length },
    message: "Users fetched successfully",
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// 🔹 Read One User by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
    success: true,
    data: { ...user.toObject(), id: user._id },
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// 🔹 Update User
app.put("/users/:id", async (req, res) => {
  try {
    const updateData = req.body;
    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const validationErrors = validateUser({
      name: updateData.name || existingUser.name,
      email: updateData.email || existingUser.email,
      age: updateData.age || existingUser.age,
      department: updateData.department || existingUser.department,
      role: updateData.role || existingUser.role,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, error: validationErrors.join(", ") });
    }

    // Check if email is being updated to an existing one
    if (updateData.email && updateData.email !== existingUser.email) {
      const userWithEmail = await User.findOne({ email: updateData.email });
      if (userWithEmail) {
        return res.status(400).json({ success: false, error: "Email already exists" });
      }
    }

    Object.assign(existingUser, updateData, { updatedAt: new Date() });
    await existingUser.save();

    res.status(200).json({
    success: true,
    data: { ...existingUser.toObject(), id: existingUser._id },
    message: "User updated successfully"
    });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// 🔹 Delete User
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ===== Health Check =====
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
