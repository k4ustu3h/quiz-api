const express = require("express");
const router = express.Router();
const Question = require("../models/Questions");

// Get Random Questions
router.get("/random/:count", async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 5;  // Default to 5 if count is not provided
        const questions = await Question.aggregate([{ $sample: { size: count } }]);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
