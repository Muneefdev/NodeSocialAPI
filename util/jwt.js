import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Function to generate a JWT token
export function generateToken(payload) {
	return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
}

// Middleware to verify the JWT token from the request headers
export function isAuthenticated(req, res, next) {
	const token = req.headers.authorization;

	if (!token || !token.startsWith("Bearer ")) {
		const error = new Error("No valid token provided.");
		error.statusCode = 422;
		throw error;
	}

	const tokenValue = token.split(" ")[1];
	const secretKey = process.env.SECRET_KEY;

	try {
		const decodedToken = jwt.verify(tokenValue, secretKey);

		if (!decodedToken) {
			const error = new Error("Not authenticated.");
			error.statusCode = 401;
			throw error;
		}

		req.user = decodedToken; // Store the decoded user information in the request object
		next();
	} catch (err) {
		next(err);
	}
}
