const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  age: {
    type: Number,
    min: 1,
    max: 120,
    required: true,
  },
  department: {
    type: String,
    required: true,
    minlength: 2,
  },
  role: {
    type: String,
    required: true,
    minlength: 2,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("User", userSchema);
