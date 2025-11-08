const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Google Login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback setelah login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
    session: false,
  }),
  (req, res) => {
    // Buat JWT token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect ke frontend dengan token
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
);

// Route untuk ambil user saat sudah login (optional)
router.get("/me", async (req, res) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({ message: "No token provided" });

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const User = require("../models/User");
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Auth /me error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
