import express from "express";
import { User } from "../models/User";
import { validateUser } from "../src/utils/validateUser";

const router = express.Router();

// GET /users
router.get("/", async (_, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users.map(u => ({ ...u.toObject(), id: u._id })) });
});

// POST /users
router.post("/", async (req, res) => {
  const errors = validateUser(req.body);
  if (errors.length > 0) return res.status(400).json({ success: false, error: errors.join(", ") });

  const exists = await User.findOne({ email: req.body.email });
  if (exists) return res.status(400).json({ success: false, error: "Email already exists" });

  const user = new User(req.body);
  await user.save();
  res.status(201).json({ success: true, data: user });
});

// GET /users/:id
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: "User not found" });
  res.json({ success: true, data: user });
});

// PUT /users/:id
router.put("/:id", async (req, res) => {
  const existingUser = await User.findById(req.params.id);
  if (!existingUser) return res.status(404).json({ success: false, error: "User not found" });

  const errors = validateUser({ ...existingUser.toObject(), ...req.body });
  if (errors.length > 0) return res.status(400).json({ success: false, error: errors.join(", ") });

  Object.assign(existingUser, req.body, { updatedAt: new Date() });
  await existingUser.save();

  res.json({ success: true, data: existingUser });
});

// DELETE /users/:id
router.delete("/:id", async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: "User not found" });
  res.json({ success: true, message: "User deleted successfully" });
});

export default router;
