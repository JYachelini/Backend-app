import { Router } from 'express'
import { logProductsError } from '../Middlewares/Logs'
import Products from '../Controllers/products'
import { ProductInterface } from '../Interfaces/CartInterface'
import { isAdministrator } from '../Middlewares/isAdministrator'

const products = new Products()
export const routerProduct = Router()

routerProduct.use(logProductsError)
routerProduct.route('/api/productos/:id?')
	.get(async (req, res) => {
		let id: number
		if (req.body.id) {
			id = Number(req.body.id)
		} else {
			id = Number(req.params.id)
		}
		if (id) {
			const product = await products.getById(id)
			product ? res.status(200).json(product) : res.status(404).json({ error: ' Error with ID ' })
		} else {
			const allProducts: ProductInterface[] = await products.getAll()
			allProducts ? res.status(200).json(allProducts) : res.status(404)
		}
	})
	.post(isAdministrator, async (req: any, res: any) => {
		if (req.params.id) {
			res.status(400).json({ error: ' No se puede crear un producto con un id' })
		} else {
			const newObj: ProductInterface = req.body
			const newId = await products.save(newObj)
			res.status(200).json(`El producto ${newObj.nombre} con el id ${newId} se generó correctamente`)
		}
	})
	.put(isAdministrator, async (req, res) => {
		const newValues: ProductInterface = req.body
		let  id = Number(req.body.id)
		await products.modifyById(newValues, id).then((result) => (result ? res.status(202).json('Producto modificado') : res.status(404).json('No se encontró el producto')))
	})
	.delete(isAdministrator, async (req, res) => {
		let id: number
		if (req.body.id) {
			id = Number(req.body.id)
		} else {
			id = Number(req.params.id)
		}
		products.deleteById(id).then((result) => (result ? res.status(202).json('Producto eliminado') : res.status(404).json({ error: 'El producto no existe' })))
	})