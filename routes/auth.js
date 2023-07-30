import express from "express";
import { body } from "express-validator";

import { login, signup } from "../controllers/auth.js";
import User from "../models/user.js";

const router = express.Router();

router.put(
	"/signup",
	[
		body("email")
			.isEmail()
			.withMessage("Please enter a valid email address.")
			.normalizeEmail()
			.custom(async (value, { req }) => {
				// Check if the email already exists in the database
				const existingUser = await User.findOne({ email: value });
				if (existingUser) {
					throw new Error(
						"Email already exists. Please use a different email."
					);
				}
				return true;
			}),

		body("name")
			.trim()
			.isLength({ min: 2 })
			.withMessage("Name must be at least 2 characters long."),

		body("password")
			.trim()
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters long."),
	],
	signup
);

router.post("/login", login);

export default router;
