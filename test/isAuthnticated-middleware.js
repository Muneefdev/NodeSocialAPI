import { expect } from "chai";
import { isAuthenticated } from "../util/jwt.js";

describe("isAuthenticated middleware", function () {
	it("should throw an error if no authorization header is present", function () {
		const req = {
			get: (headerName) => null,
		};
		const res = {};
		const next = () => {};

		expect(() => isAuthenticated(req, res, next)).to.throw(
			"No valid token provided."
		);
	});

	it("should throw an error if the authorization header is not a Bearer token", function () {
		const req = {
			get: (headerName) => null,
		};
		const res = {};
		const next = () => {};

		expect(() => isAuthenticated(req, res, next)).to.throw(
			"No valid token provided."
		);git 
	});
});
