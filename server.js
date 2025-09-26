const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// --- MongoDB connection ---
mongoose.connect("mongodb+srv://mdshahriarsajib47309185_db_user:1234@cluster0.6jwnnp1.mongodb.net/loginAPI?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --- User Schema ---
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

// --- Register Route ---
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({ success: false, message: "Email already registered" });
  }

  // Save new user
  const user = new User({ name, email, password });
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

// --- Start Server ---
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});