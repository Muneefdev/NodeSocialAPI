import mongoose, { Schema } from "mongoose";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const currentPath = fileURLToPath(import.meta.url);
const appPath = dirname(currentPath);

import fs from "fs";

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		creator: {
			type: Object,
			required: true,
		},
	},
	{ timestamps: true }
);

postSchema.methods.clearImage = function () {
	const imagePath = path.join(appPath, "../", this.imageUrl);
	fs.unlink(imagePath);
};

export default mongoose.model("Post", postSchema);
