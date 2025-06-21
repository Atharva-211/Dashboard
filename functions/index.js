const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

admin.initializeApp();
const db = admin.firestore();

// Helper function for user validation
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

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// GET /users - Get all users
app.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({
      success: true,
      data: { users, total: users.length },
      message: "Users fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /users - Create new user
app.post("/users", async (req, res) => {
  try {
    const userData = req.body;
    const errors = validateUser(userData);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(", ") });
    }

    const existingUser = await db.collection("users").where("email", "==", userData.email).get();
    if (!existingUser.empty) {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }

    const newUser = {
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("users").add(newUser);
    const doc = await docRef.get();

    res.status(201).json({
      success: true,
      data: { id: doc.id, ...doc.data() },
      message: "User created successfully"
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /users/:id - Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PUT /users/:id - Update user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updateData = req.body;

    const validationErrors = validateUser({
      name: updateData.name || doc.data().name,
      email: updateData.email || doc.data().email,
      age: updateData.age || doc.data().age,
      department: updateData.department || doc.data().department,
      role: updateData.role || doc.data().role,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, error: validationErrors.join(", ") });
    }

    // Check if email is being changed to an existing one
    if (updateData.email && updateData.email !== doc.data().email) {
      const existingUser = await db.collection("users").where("email", "==", updateData.email).get();
      if (!existingUser.empty) {
        return res.status(400).json({ success: false, error: "Email already exists" });
      }
    }

    await userRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updatedDoc = await userRef.get();

    res.status(200).json({
      success: true,
      data: { id: updatedDoc.id, ...updatedDoc.data() },
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /users/:id - Delete user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    await userRef.delete();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

exports.api = functions.https.onRequest(app);
