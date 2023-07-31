import { validationResult } from "express-validator";
import Post from "../models/post.js";
import User from "../models/user.js";

export async function getPosts(req, res, next) {
	try {
		const postsList = await Post.find();

		if (!postsList) {
			const error = new Error("Not posts found!");
			error.statusCode = 404;
			throw error;
		}

		res.status(200).json({
			message: "Products fetched successfully.",
			posts: postsList,
		});
	} catch (error) {
		next(error);
	}
}

export async function createPost(req, res, next) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = new Error(
				"Validation failed, entered data is incorrect."
			);
			error.statusCode = 422;
			throw error;
		}

		// check if there is a file uploaded and has png or jpg or jpeg mimetype
		if (!req.file) {
			const error = new Error("File not provided");
			error.statusCode = 422;
			throw error;
		}

		const title = req.body.title;
		const content = req.body.content;
		const imageUrl = req.file.path;
		const creatorId = req.user.userId;

		const post = await Post.create({
			title: title,
			imageUrl: imageUrl,
			content: content,
			creator: creatorId,
		});

		const user = await User.findById(req.user.userId);
		user.posts.push(post._id);
		await user.save();

		res.status(201).json({
			message: "Post Created Successfully",
			post: post,
		});
	} catch (error) {
		next(error);
	}
}

export async function getPost(req, res, next) {
	try {
		const postId = req.params.postId;
		const post = await Post.findById(postId);

		if (!post) {
			const error = new Error("Post Not Found!");
			error.statusCode = 404;
			throw error;
		}

		res.status(200).json({
			message: "Post fetched.",
			post: post,
		});
	} catch (error) {
		next(error);
	}
}

export async function updatePost(req, res, next) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = new Error(
				"Validation failed, entered data is incorrect."
			);
			error.statusCode = 422;
			throw error;
		}

		const postId = req.params.postId;
		const updatedTitle = req.body.title;
		const updatedContent = req.body.content;
		let updatedImageUrl = req.body.image;

		if (req.file) {
			updatedImageUrl = req.file.path;
		}
		if (!updatedImageUrl) {
			const error = new Error("No file picked.");
			error.statusCode = 422;
			throw error;
		}

		const post = await Post.findById(postId);

		if (!post) {
			const error = new Error("Post Not Found!");
			error.statusCode = 404;
			throw error;
		}
		//check user authorization before update
		if (post.creator.toString() !== req.user.userId) {
			const error = new Error("Not authorized.");
			error.statusCode = 403;
			throw error;
		}
		if (post.imageUrl !== updatedImageUrl) {
			post.clearImage();
		}

		post.title = updatedTitle;
		post.content = updatedContent;
		post.imageUrl = updatedImageUrl;

		const updatedPost = await post.save();

		res.status(200).json({
			message: "Post updated.",
			post: updatedPost,
		});
	} catch (error) {
		next(error);
	}
}

export async function deletePost(req, res, next) {
	try {
		const postId = req.params.postId;
		const post = await Post.findById(postId);

		if (!post) {
			const error = new Error("Post Not Found!");
			error.statusCode = 404;
			throw error;
		}

		//check user authorization before delete
		if (post.creator.toString() !== req.user.userId) {
			const error = new Error("Not authorized.");
			error.statusCode = 403;
			throw error;
		}

		post.clearImage();
		await Post.deleteOne({_id: postId});

		// delete the [id] of the deleted post from user posts array
		const user = await User.findById(req.user.userId);
		await user.posts.pull(postId);
		await user.save();

		res.status(200).json({
			message: "Post deleted successfully",
			post: post,
		});
	} catch (error) {
		next(error);
	}
}
