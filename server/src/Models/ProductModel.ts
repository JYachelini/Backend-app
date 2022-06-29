import mongoose from 'mongoose'
const product = new mongoose.Schema({
	id: { type: Number, required: true },
	timestamps: { type: Number },
	name: { type: String, required: true },
	description: { type: String, required: true },
	code: { type: String, required: true },
	url: { type: String, required: true },
	price: { type: Number, required: true },
	stock: { type: Number },
})

export default mongoose.model('products', product)
