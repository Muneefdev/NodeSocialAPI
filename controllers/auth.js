import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import { generateToken } from "../util/jwt.js";

import User from "../models/user.js";

export async function signup(req, res, next) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = new Error(
				"Validation failed, entered data is incorrect."
			);
			error.data = errors.array();
			error.statusCode = 422;
			throw error;
		}

		const email = req.body.email;
		const name = req.body.name;
		const password = req.body.password;
		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await User.create({
			email: email,
			name: name,
			password: hashedPassword,
		});

		res.status(201).json({
			message: "User created.",
			user: user,
		});
	} catch (error) {
		next(error);
	}
}

export async function login(req, res, next) {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const user = await User.findOne({ email: email });

		if (!user) {
			const error = new Error("User not found. signup to login.");
			error.statusCode = 401;
			throw error;
		}

		const isAuthenticated = await bcrypt.compare(password, user.password);

		if (!isAuthenticated) {
			const error = new Error("invalid password.");
			error.statusCode = 401;
			throw error;
		}

		const token = generateToken({ email: user.email, userId: user._id });

		res.status(200).json({
			message: "login succeed, user is authenticated.",
			token: token,
			userId: user._id,
		});
	} catch (error) {
		next(error);
	}
}
