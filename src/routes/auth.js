const express = require("express");
const { registerUser, loginUser } = require("../controller/AuthController");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

module.exports = router;
