import { Model } from 'mongoose'
import { logger } from '../server/logs'
import { ProductInterface } from '../Interfaces/CartInterface'
import ProductModel from '../Models/ProductModel'

interface Product {
	nombre: string
	descripcion: string
	codigo: string
	url: string
	precio: number
	stock: number
}

export default class Products {
	private collection: Model<ProductInterface>
	constructor() {
		this.collection = ProductModel
	}
	save = async (obj: Product): Promise<number> => {
		try {
			const products = await this.getAll()
			let newID: number
			if (products.length == 0) {
				newID = 1
			} else {
				newID = Number(products[products.length - 1].id) + 1
			}
			const newProduct: ProductInterface = { id: newID, ...obj }
			const productToAdd = new this.collection(newProduct)
			await productToAdd.save()
			return newID
		} catch (err) {
			logger!.error(`Can't save product: ${err}`)
			throw new Error(`Can't save product`)
		}
	}

	getAll = async (): Promise<ProductInterface[]> => {
		try {
			return await this.collection.find()
		} catch (err) {
			logger!.error(`Error returning all product: ${err}`)
			throw new Error('Error returning all products')
		}
	}

	getById = async (id: number): Promise<ProductInterface | null> => {
		try {
			return await this.collection.findOne({ id: id })
		} catch (err) {
			logger!.error(`Error getting the product: ${err}`)
			throw new Error('Error getting the product')
		}
	}

	modifyById = async (newValues: ProductInterface, id: number): Promise<boolean> => {
		try {
			const product = await this.getById(id)

			if (product != null) {
				const productModifed: ProductInterface = {
					id: product.id,
					nombre: newValues.nombre || product?.nombre,
					descripcion: newValues.descripcion || product.descripcion,
					codigo: product.codigo,
					url: newValues.url || product.url,
					precio: newValues.precio || product.precio,
					stock: newValues.stock || product.stock,
				}
				console.log(productModifed)
				await this.collection.findOneAndUpdate({ id: id }, { nombre: productModifed.nombre, descripcion: productModifed.descripcion, codigo: productModifed.codigo, url: productModifed.url, precio: productModifed.precio, stock: productModifed.stock })
				return true
			} else {
				return false
			}
		} catch (err) {
			logger!.error(`Error trying to modify the product: ${err}`)
			throw new Error('Error trying to modify the product')
		}
	}

	deleteById = async (id: number): Promise<boolean> => {
		try {
			const productToDelete = this.getById(id)
			if (productToDelete != null) {
				await this.collection.deleteOne({ id: id })
				return true
			} else {
				return false
			}
		} catch (err) {
			logger!.error(`Error deleting the product: ${err}`)
			throw new Error('Error deleting the product')
		}
	}

	deleteAll = async (): Promise<void> => {
		try {
			await this.collection.remove()
		} catch (err) {
			logger!.error(`Error deleting all products: ${err}`)
			throw new Error('Error deleting all products')
		}
	}
}
