const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Question = require("../models/Questions");

router.get("/random", async (req, res) => {
	const excludedIds = req.query.excludedIds
		? JSON.parse(req.query.excludedIds)
		: [];
	const objectIdExcludedIds = excludedIds
		.map((id) => {
			try {
				return new mongoose.Types.ObjectId(id);
			} catch (error) {
				console.error("Invalid ObjectId:", id);
				return null;
			}
		})
		.filter((id) => id !== null);

	try {
		const questions = await Question.aggregate([
			{ $match: { _id: { $nin: objectIdExcludedIds } } },
			{ $sample: { size: 1 } },
		]);
		if (questions && questions.length > 0) {
			res.json(questions[0]); // Send back a single question object
		} else {
			res.status(404).json({ message: "No questions found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/", async (req, res) => {
	const count = parseInt(req.query.count);
	if (isNaN(count) || count <= 0) {
		return res.status(400).json({ message: "Invalid question count." });
	}

	try {
		const questions = await Question.aggregate([
			{ $sample: { size: count } },
		]);
		res.json(questions);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
