const express = require("express");
const router = express.Router();
const Question = require("../models/Questions");

// Get Random Question (default to 1)
router.get("/random", async (req, res) => {
	try {
		const questions = await Question.aggregate([{ $sample: { size: 1 } }]);
		if (questions && questions.length > 0) {
			res.json(questions[0]); // Send back a single question object
		} else {
			res.status(404).json({ message: "No questions found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get All Questions (default sort by _id)
router.get("/", async (req, res) => {
	try {
		const questions = await Question.find().sort({ _id: 1 });
		res.json(questions);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
