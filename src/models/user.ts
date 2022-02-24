import mongoose, { Schema, Document } from 'mongoose';
import { userInterface } from '../interface';

const userSchema: Schema = new mongoose.Schema({
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
	DOB: {
		type: Date,
		required: false,
	},
	gender: {
		type: String,
		required: false,
	},
	followingList: {
		type: [String],
		required: false,
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

export default mongoose.model<userInterface>('User', userSchema);
