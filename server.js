const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 9090;
const quizRoutes = require("./routes/quizRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/questions", quizRoutes);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
	res.send("Quiz App Backend is running!");
});

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
