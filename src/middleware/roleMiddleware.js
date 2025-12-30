const teacherOnly = (req, res, next) => {
    if(req.user.role !== "teacher"){
        return res.status(403).json({ error: "Access denied" });
    }

    next();
}

module.exports = teacherOnly;