import { Router } from 'express'
import { logger } from '../server/logs'
import Cart from '../Controllers/cart.controller'
import Products from '../Controllers/products.controller'
import Mailer from '../Controllers/mail.controller'
import { confirmationOrder } from '../Controllers/phoneMSG.controller'

const Mail = new Mailer()

const products = new Products()

const cart = new Cart()

export const routerCart = Router()

routerCart
	.route('/api/carrito')
	.post(async (req, res) => {
		const newCart = req.body.cart
		await cart.createOrder(newCart)
		confirmationOrder(newCart)
		await Mail.newOrderMail(req, res)
	})
	.delete(async (req, res) => {
		let id = Number(req.body.id)
		cart.deleteCartById(id).then((result) => (result ? res.send('Carrito eliminado') : res.sendStatus(404).send('No se encontró el carrito')))
	})
	.get(async (req, res) => {
		const lastID = await cart.getLastCart()
		res.send({ id: lastID })
		// await cart.getLastCart().then((result) => (result ? res.send(result) : null))
		// logger!.info(await cart.getLastCart().then((result)=>result))
	})

routerCart
	.route('/api/carrito/productos')
	.get(async (req, res) => {
		let id: number = req.body.id
		if (id) {
			const products = await cart.getAllProdById(id)
			products ? res.json(products) : res.sendStatus(404).json({ error: 'No se encontró el carrito solicitado' })
		} else {
			res.sendStatus(404).json({ error: 'Es necesario un ID para buscar el carrito' })
		}
	})
	.post(async (req, res) => {
		let id = Number(req.body.id)
		let id_prod = Number(req.body.id_prod)
		const product = await products.getById(id_prod)
		if (product != null) {
			cart.addProduct(id, product)
			res.json(`El producto fue agregado al carrito.`)
		} else {
			res.sendStatus(400).json(`Error adding the product.`)
		}
	})
	.delete(async (req, res) => {
		let id = Number(req.body.id)
		let id_prod = Number(req.body.id_prod)
		await cart.deleteProdById(id, id_prod).then((response) => {
			response ? res.json(`El producto fue eliminado`) : res.sendStatus(400).json('No se encontró el producto a eliminar')
		})
	})
