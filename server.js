const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// --- MongoDB connection ---
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// --- User Schema ---
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

// --- Register Route ---
app.post("/register", async (req, res) => {
  const { paypass, email, password } = req.body;
  const nextw=0,processing=0,spint=0,topupt=0;
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({ success: false, message: "Email already registered" });
  }

  // Save new user
  const user = new User({ paypass, email, password,nextw,processing,spint,topupt });
  await user.save();

  res.json({ success: true, message: "User registered successfully" });
});

// --- Login Route ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) {
    return res.json({ success: false, message: "Invalid email or password" });
  }

  res.json({ success: true, message: "Login successful", user });
});

// Update name route
app.post('/update-pro', async (req, res) => {
  try {
    const { email, password, pro } = req.body;

    // Find user by email + password
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Update the name
    user.processing = pro;
    await user.save();

    res.json({ success: true, message: "Name updated successfully", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating name", error: err.message });
  }
});

app.post('/update-pro-spin', async (req, res) => {
  try {
    const { email, password, pro,spin } = req.body;

    // Find user by email + password
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Update the name
    user.processing = pro;
    user.spint = spin;
    await user.save();

    res.json({ success: true, message: "Name updated successfully", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating name", error: err.message });
  }
});



// --- Start Server ---
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});