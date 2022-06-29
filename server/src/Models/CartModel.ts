import mongoose from 'mongoose'
const cart = new mongoose.Schema({
	id:{type:Number, required:true, unique: true},
    timestamp: {type:Number},
    productos: {type: Array}
})

export default mongoose.model('carts', cart)
