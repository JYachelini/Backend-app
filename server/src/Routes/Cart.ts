import { Router } from 'express'
import Cart from '../Controllers/cart'
import Products from '../Controllers/products'

const products = new Products()

const cart = new Cart()

export const routerCart = Router()

routerCart
	.route('/api/carrito')
	.post(async (req, res) => {
		if (req.body.id) {
			res.status(400).json({ error: 'No se puede crear un carrito con ID manual' })
		} else {
			const id = await cart.create()
			res.status(200).json(id)
		}
	})
	.delete(async (req, res) => {
		let id = Number(req.body.id)
		cart.deleteCartById(id).then((result) => (result ? res.status(202).json('Carrito eliminado') : res.status(404).json('No se encontró el carrito')))
	})
	.get(async (req, res) => {
		let id = req.body.id
		cart.getCartById(id).then((result) => (result ? res.status(202).json(result) : res.status(400).json({ error: 'error getting the cart' })))
	})

routerCart
	.route('/api/carrito/productos')
	.get(async (req, res) => {
		let id: number = req.body.id
		if (id) {
			const products = await cart.getAllProdById(id)
			products ? res.status(200).json(products) : res.status(404).json({ error: 'No se encontró el carrito solicitado' })
		} else {
			res.status(404).json({ error: 'Es necesario un ID para buscar el carrito' })
		}
	})
	.post(async (req, res) => {
		let id = Number(req.body.id)
		let id_prod = Number(req.body.id_prod)
		const product = await products.getById(id_prod)
		if (product != null) {
			cart.addProduct(id, product)
			res.status(202).json(`El producto fue agregado al carrito.`)
		} else {
			res.status(400).json(`Error adding the product.`)
		}
	})
	.delete(async (req, res) => {
		let id = Number(req.body.id)
		let id_prod = Number(req.body.id_prod)
		await cart.deleteProdById(id, id_prod).then((response) => {
			response ? res.status(202).json(`El producto fue eliminado`) : res.status(400).json('No se encontró el producto a eliminar')
		})
	})
