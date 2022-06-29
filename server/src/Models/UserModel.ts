import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const user = new mongoose.Schema({
	username: { type: String, unique: true },
	password: String,
	isAdmin: { type: Boolean, default: false },
})

export default mongoose.model('users', user)
