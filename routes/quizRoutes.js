const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Question = require("../models/Questions");

router.get("/categories", async (req, res) => {
	try {
		const categories = await Question.distinct("category");
		res.json(categories);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/random", async (req, res) => {
	const { excludedIds, category } = req.query;
	const objectIdExcludedIds = excludedIds
		? JSON.parse(excludedIds)
				.map((id) => {
					try {
						return new mongoose.Types.ObjectId(id);
					} catch (error) {
						console.error("Invalid ObjectId:", id);
						return null;
					}
				})
				.filter((id) => id !== null)
		: [];

	const matchStage = { _id: { $nin: objectIdExcludedIds } };
	if (category && category !== "All") {
		matchStage.category = category;
	}

	try {
		const questions = await Question.aggregate([
			{ $match: matchStage },
			{ $sample: { size: 1 } },
		]);
		if (questions && questions.length > 0) {
			res.json(questions[0]);
		} else {
			res.status(404).json({ message: "No questions found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/", async (req, res) => {
	const { count, category } = req.query;
	const numCount = parseInt(count);
	const query = {};

	if (category && category !== "All") {
		query.category = category;
	}

	if (isNaN(numCount) || numCount <= 0) {
		try {
			const questions = await Question.find(query).sort({ _id: 1 });
			res.json(questions);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
		return;
	}

	try {
		const aggregatePipeline = [];
		if (query.category) {
			aggregatePipeline.push({ $match: query });
		}
		aggregatePipeline.push({ $sample: { size: numCount } });
		const questions = await Question.aggregate(aggregatePipeline);
		res.json(questions);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
