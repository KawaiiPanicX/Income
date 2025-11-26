const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors()); // Enable CORS for all routes

// --- MongoDB connection ---
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// --- User Schema ---
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  paypass: String,
  nextw: Number,
  processing: Number,
  spint: Number,
  topupt: Number
});

const User = mongoose.model("User", UserSchema);


const SajibUserSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  password: String,
  owner: String,
  points: Number,
  topuptimes: Number,
  datas: String
});

const SajibUser = mongoose.model("SajibUser", SajibUserSchema, "sajibusers");
// --- Register Route ---
app.post("/register", async (req, res) => {
  const { paypass, email, password } = req.body;
  const nextw=0,processing=0,spint=5,topupt=0;
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

// SajibUser Registration 

app.post("/add-user", async (req, res) => {
  const { name, password, owner } = req.body;
  const points=0,datas="",topuptimes=0;
  // Check if email already exists
  const existingUser = await SajibUser.findOne({ name });
  if (existingUser) {
    return res.json({ success: false, message: "name already exist" });
  }

  // Save new user
  const user = new SajibUser({ name, password, owner,points,topuptimes,datas });
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

app.post('/update-nxt-spin', async (req, res) => {
  try {
    const { email, password, pro,spin } = req.body;

    // Find user by email + password
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    
    if(user.processing<pro){
      user.topupt=user.topupt+1;
    }

    // Update the name
    user.nextw = pro;
    user.spint = spin;
    await user.save();

    res.json({ success: true, message: "successful", user });
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

    res.json({ success: true, message: "successful", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating name", error: err.message });
  }
});
      


/// for second app

app.post('/update-info', async (req, res) => {
  try {
    const { name, amount} = req.body;

    // Find user by email + password
    const user = await SajibUser.findOne({name});

    if (!user) {
      return res.json({ success: false, message: "Invalid Info" });
    }else{

    // Update the name
    user.points = user.points+Number(amount);
    user.topuptimes = user.topuptimes+1;
    user.datas = user.datas+Number(amount)/10+",";
    await user.save();

    res.json({ success: true, message: "Stored successfully", user});
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating name", error: err.message });
  }
});

// Checking 

app.post('/checking', async (req, res) => {
  try {
    const { name, amount} = req.body;

    // Find user
    const user = await SajibUser.findOne({name});

    if (!user) {
      return res.json({ success: false});
    }else{    
      res.json({ success: true});
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Error", error: err.message });
  }
});


// --- Delete Account Route ---
app.post("/delete-account", async (req, res) => {
  try {
    const { email, paypass } = req.body;

    // Check if both fields are provided
    if (!email || !paypass) {
      return res.status(400).json({ success: false, message: "Email and paypass are required" });
    }

    // Find user by email and paypass
    const user = await User.findOne({ email, paypass });

    if (!user) {
      return res.json({ success: false, message: "Invalid email or paypass" });
    }

    // Delete user
    await User.deleteOne({ _id: user._id });

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting account", error: err.message });
  }
});



// --- Start Server ---
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
