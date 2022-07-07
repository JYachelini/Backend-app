import { Model } from 'mongoose'
import { logger } from '../server/logs'
import { CartInterface, ProductInterface } from '../Interfaces/CartInterface'
import CartModel from '../Models/CartModel'

export default class Cart {
	private collection: Model<CartInterface>
	constructor() {
		this.collection = CartModel
	}
	create = async (): Promise<number> => {
		try {
			const carts = await this.getAllCart()
			let newID: number
			if (carts.length == 0) {
				newID = 1
			} else {
				newID = Number(carts[carts.length - 1].id) + 1
			}
			const timestamp = Date.now()
			const newCart = { id: newID, timestamp: timestamp, productos: [] }
			const cart = new this.collection(newCart)
			await cart.save()
			return newID
		} catch (err) {
			logger!.error(`Can't create cart ${err}`)
			throw new Error(`Can't create cart`)
		}
	}

	getAllCart = async (): Promise<CartInterface[]> => {
		try {
			return await this.collection.find()
		} catch (err) {
			logger!.error(`Error getting all carts ${err}`)
			throw new Error('Error getting all carts')
		}
	}

	getCartById = async (cartId: number): Promise<any> => {
		try {
			const carts = await this.getAllCart()
			const el = carts.findIndex((e: CartInterface) => e.id === cartId)
			const id = carts[el]._id
			return this.collection.findById(id)
		} catch (error) {
			logger!.error(`Error getting cart by ID: ${error}`)
			throw new Error('Error getting cart by ID')
		}
	}

	addProduct = async (cartId: number, obj: ProductInterface): Promise<void> => {
		try {
			const productToAdd = obj
			const cart = await this.getAllCart()
			const cartIndex = cart.findIndex((e: CartInterface) => e.id === cartId)
			const productsInCart = cart[cartIndex].productos
			const duplicatedIndex = productsInCart.findIndex((e: ProductInterface) => e.id === obj.id)

			if (duplicatedIndex != -1) {
				const priceOfProduct = productsInCart[duplicatedIndex].precio
				if (productsInCart[duplicatedIndex].stock) {
					productsInCart[duplicatedIndex].stock++
					productsInCart[duplicatedIndex].precio = priceOfProduct * productsInCart[duplicatedIndex].stock
					await this.collection.updateOne(
						{ id: cartId },
						{
							$set: { productos: productsInCart },
						}
					)
				} else {
					productsInCart[duplicatedIndex].stock = 2
					productsInCart[duplicatedIndex].precio = priceOfProduct * productsInCart[duplicatedIndex].stock
					await this.collection.updateOne(
						{ id: cartId },
						{
							$set: { productos: productsInCart },
						}
					)
				}
			} else {
				productsInCart.push(productToAdd)
				await this.collection.updateOne(
					{ id: cartId },
					{
						$set: { productos: productsInCart },
					}
				)
			}
		} catch (err) {
			logger!.error(`Error adding product: ${err}`)
			throw new Error('Error adding product')
		}
	}

	getAllProdById = async (cartId: number): Promise<ProductInterface[]> => {
		try {
			const cart = await this.collection.findOne({ id: cartId })
			const products = cart!.productos

			if (products) {
				return products
			} else {
				logger!.error(`Product didn't exist`)
				throw new Error(`Product didn't exist`)
			}
		} catch(err) {
			logger!.error(`Error getting the product: ${err}`)
			throw new Error('Error getting the product')
		}
	}

	deleteCartById = async (cartId: number): Promise<boolean> => {
		try {
			const cartToDelete = await this.getAllCart()
			const cartIndex = cartToDelete.findIndex((e: CartInterface) => e.id == cartId)
			const _id = cartToDelete[cartIndex]._id
			if (cartToDelete.length === 0) {
				return false
			} else {
				if (cartIndex >= 0) {
					await this.collection.deleteOne({ _id: _id })
					return true
				} else {
					return false
				}
			}
		} catch (err) {
			logger!.error(`Error deleting cart: ${err}`)
			throw new Error('Error deleting cart')
		}
	}

	deleteProdById = async (cartId: number, prodId: number): Promise<boolean> => {
		try {
			const carts = await this.getAllCart()
			const cartIndex = carts.findIndex((e: CartInterface) => e.id == cartId)

			if (cartIndex >= 0) {
				const productsOnCart = carts[cartIndex].productos
				const prodToDeleteIndex = productsOnCart.findIndex((e: ProductInterface) => e.id == prodId)
				if (prodToDeleteIndex >= 0) {
					productsOnCart.splice(prodToDeleteIndex, 1)
					await this.collection.updateOne(
						{ id: cartId },
						{
							$set: { productos: productsOnCart },
						}
					)
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		} catch(err) {
			logger!.error(`Error deleting the product ${err}`)
			throw new Error('Error deleting the product')
		}
	}

	deleteAllCarts = async (): Promise<boolean> => {
		try {
			await this.collection.remove()
			return true
		} catch (err) {
			logger!.error(`Error deleting all carts: ${err}`)
			throw new Error('error deleting all carts')
		}
	}
}
