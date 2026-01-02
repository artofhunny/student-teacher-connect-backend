const express = require("express");
const { registerUser, loginUser, fetchProfile, logoutUser } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/profile", authMiddleware, fetchProfile);
router.get("/auth/logout", logoutUser);

module.exports = router;
