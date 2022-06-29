import mongoose from 'mongoose'

const message = new mongoose.Schema({
    author: {
		// id: { type: String, required: true },
		// firstName: { type: String, required: true, max: 50 },
		// lastName: { type: String, required: true, max: 50 },
		// age: { type: Number, required: true },
		alias: { type: String, required: true, max: 20 },
		// avatar: { type: String, required: true },
	},
	text: { type: String, required: true, max: 500 },
})

export default mongoose.model('messages', message)