import mongoose, { Schema } from 'mongoose';
import { postInterface } from '../interface';

const postSchema: Schema = new mongoose.Schema({
	userID: {
		type: String,
		required: true,
	},
	caption: {
		type: String,
		required: true,
	},
	image: {
		data: Buffer,
		contentType: String,
	},
	createdAt: {
		type: Date,
		required: false,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		required: false,
	},
});

export default mongoose.model<postInterface>('Post', postSchema);
