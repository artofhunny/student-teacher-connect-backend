const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const teacherOnly = require("../middleware/roleMiddleware");
const { createAssignment, getAssignments } = require("../controller/assignmentController");

const router = express.Router();

router.post("/assignment", authMiddleware, teacherOnly, createAssignment);

router.get("/assignment", authMiddleware, getAssignments);


module.exports = router;