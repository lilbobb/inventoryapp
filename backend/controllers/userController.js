const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//register user

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // token generation
  const token = genToken(user._id);

  // send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    const error = new Error("Invalid user data");
    error.status = 400;
    return next(error);
  }
});

//login user
const login = asyncHandler(async (req, res) => {});

module.exports = {
  registerUser,
  login,
};
