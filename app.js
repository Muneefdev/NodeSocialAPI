import { fileURLToPath } from "url";
import path, { dirname } from "path";
const currentPath = fileURLToPath(import.meta.url);
const appPath = dirname(currentPath);

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";

import feedRoutes from "./routes/feed.js";
import authRoutes from "./routes/auth.js";

const app = express();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "images");
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + "-" + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];

	if (allowedMimeTypes.includes(file.mimetype)) {
		// Accept the file
		cb(null, true);
	} else {
		// Reject the file
		cb(null, false);
	}
};

app.use(bodyParser.json());
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use("/images", express.static(path.join(appPath + "images")));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// express error handling middleware
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message;
	const data = err.data;

	res.status(statusCode).json({
		error: message,
		data: data,
	});
});

const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_CONNECTION);
		app.listen(process.env.PORT || 8080, () => {
			console.log(`Server running on http://localhost:${process.env.PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};
connectDb();
