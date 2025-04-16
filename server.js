const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 9090;
const quizRoutes = require("./routes/quizRoutes");

// Middleware
const corsOptions = {
	origin: "*", // Allow requests from your frontend origin
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify allowed HTTP methods
	credentials: true, // Enable sending cookies across origins if needed
	optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Apply CORS middleware with options
app.use(bodyParser.json());
app.use("/api/questions", quizRoutes);

// MongoDB Connection
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Start Server
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
