import mongoose from 'mongoose'

const message = new mongoose.Schema({
    author: {
		// id: { type: String, required: true },
		// mail: {type:String, unique:true, required:true},
		// firstName: { type: String, required: true, max: 50 },
		// lastName: { type: String, required: true, max: 50 },
		// age: { type: Number, required: true },
		username: { type: String, required: true, max: 20 },
		avatar: { type: String },
	},
	text: { type: String, required: true, max: 500 },
})

export default mongoose.model('messages', message)