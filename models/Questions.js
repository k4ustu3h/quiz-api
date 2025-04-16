const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	questionText: { type: String, required: true },
	options: { type: [String], required: true },
	correctAnswer: { type: String, required: true },
});

module.exports = mongoose.model("Question", questionSchema);
