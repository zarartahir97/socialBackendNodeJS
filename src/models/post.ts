import mongoose, { Schema, Document } from 'mongoose';
import { userInterface } from './user';

export interface postInterface extends Document {
    userID: userInterface['_id'],
    caption: string,
    createdAt: Date,
    updatedAt: number,
  }

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

module.exports = mongoose.model<postInterface>('Post', postSchema);
