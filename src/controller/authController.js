const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const validator = require("validator");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        error:
          "Password must be strong (uppercase, lowercase, number, special char)",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const dataObj = {
      fullName,
      email,
      password: hashedPassword,
      role,
    };

    const user = new User(dataObj);
    await user.save();

    const token = await jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // res.cookie(
    //   "token",
    //   token
    //   // {
    //   //     httpOnly: true,
    //   //     secure: true,
    //   //     sameSite: "none",
    //   //     maxAge: 7 * 24 * 60 * 60 * 1000,
    //   // }
    // );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // MUST be true in production
      sameSite: "none", // MUST be "none" for cross-site
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "signup successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Send token via httpOnly cookie
    // res.cookie(
    //   "token",
    //   token
    //   //  {
    //   //     httpOnly: true,
    //   //     secure: process.env.NODE_ENV === "production",
    //   //     sameSite: "none",
    //   //     maxAge: 7 * 24 * 60 * 60 * 1000,
    //   // }
    // );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // MUST be true in production
      sameSite: "none", // MUST be "none" for cross-site
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 6️⃣ Send safe user response
    res.status(200).json({
      message: "Login successful",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchProfile = async (req, res) => {
  try {
    const _id = req.user._id;

    const user = await User.findById(_id);

    if (user) {
      return res.json({
        message: "Profile Fetched!",
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
    }

    res.status(400).json({ error: "Please login" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  fetchProfile,
};
