import express from "express";
import { body } from "express-validator";

import {
	createPost,
	deletePost,
	getPost,
	getPosts,
	updatePost,
} from "../controllers/feed.js";
import { isAuthenticated } from "../util/jwt.js";

const router = express.Router();

//GET: /feed/posts
router.get("/posts", isAuthenticated, getPosts);

//POST: /feed/post
router.post(
	"/post",
	isAuthenticated,
	[
		body("title").trim().isLength({ min: 5 }),
		body("content").trim().isLength({ min: 5 }),
	],
	createPost
);

//GET: /feed/post/:postId
router.get("/post/:postId", isAuthenticated, getPost);

//PUT: /feed/post/:postId
router.put(
	"/post/:postId",
	isAuthenticated,
	[
		body("title").trim().isLength({ min: 5 }),
		body("content").trim().isLength({ min: 5 }),
	],
	updatePost
);

//Delete: /feed/post/:postId
router.delete("/post/:postId", isAuthenticated, deletePost);

export default router;
