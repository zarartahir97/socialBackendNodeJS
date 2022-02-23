import mongoose, { Schema, Document } from 'mongoose';

export interface userInterface extends Document {
    name: string,
    email: string,
    password: string,
    DOB: Date,
    gender: string,
    followingList: string[],
    createdAt: Date,
    updatedAt: number,
}

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

module.exports =  mongoose.model<userInterface>('User', userSchema);
