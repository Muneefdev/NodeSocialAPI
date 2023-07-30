import mongoose, { Schema, SchemaTypes } from "mongoose";

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			default: "I am new",
		},
		posts: [
			{
				type: SchemaTypes.ObjectId,
				ref: "Post",
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema);
