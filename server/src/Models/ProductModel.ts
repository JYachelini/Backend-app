import mongoose from 'mongoose'
const product = new mongoose.Schema({
	id: { type: Number, required: true },
	nombre: { type: String, required: true },
	descripcion: { type: String, required: true },
	codigo: { type: String, required: true },
	url: { type: String, required: true },
	precio: { type: String, required: true },
	stock: { type: String },
})

export default mongoose.model('products', product)
