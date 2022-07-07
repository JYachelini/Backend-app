import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const user = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	mail: {type:String, unique:true, required:true},
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false },
	firstName: { type: String, required: true, max: 20 },
	lastName: { type: String, required: true, max: 20 },
	address: { type: String, required: true, max: 50 },
	age: { type: String, required: true, max: 3 },
	phone: { type: String, required: true, max: 20 },
	avatar: { type: String },
})

export default mongoose.model('users', user)
