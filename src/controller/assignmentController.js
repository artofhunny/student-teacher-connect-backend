const Assignment = require("../model/Assignment");

const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, deadline } = req.body;

    if (!title || !description || !subject || !deadline) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const assignment = await Assignment.create({
      teacherId: req.user._id,
      title,
      description,
      subject,
      deadline,
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("teacherId", "fullName email");

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createAssignment, getAssignments };
