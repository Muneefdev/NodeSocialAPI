import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

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
