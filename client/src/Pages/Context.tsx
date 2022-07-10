import axios, { AxiosResponse } from 'axios'
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { CartInterface, ProductInterface } from '../Interfaces/CartInterface'
import { UserInterface } from '../Interfaces/UserInterface'

export const myContext = createContext<Partial<any>>({})
export default function Context(props: PropsWithChildren<any>) {
	const [user, setUser] = useState<UserInterface>()
	const [cartID, setCartID] = useState<number>()
	const [cart, setCart] = useState<CartInterface>()

	useEffect(() => {
		axios.get('/user', { withCredentials: true }).then((res: AxiosResponse) => {
			setUser(res.data)
		})
		axios.get('/api/carrito', { withCredentials: true }).then((res: AxiosResponse) => {
			setCartID(res.data.id + 1)
		})
	}, [])

	const addToCart = async (e: any) => {
		e.preventDefault()
		const ID_PRODUCT = e.target.id
		const productToAdd: ProductInterface = await axios.post('/api/productos/get', { id: ID_PRODUCT }, { withCredentials: true }).then((result) => result.data)
		if (productToAdd) {
			if (!cart) {
				const tempCart: CartInterface = { id: cartID!, productos: [productToAdd] }
				setCart(tempCart)
			} else {
				const productsInCart = cart?.productos
				productsInCart?.push(productToAdd)
				const tempCart: CartInterface = { ...cart!, productos: productsInCart! }
				setCart(tempCart)
			}
		}
	}

	return <myContext.Provider value={[user!, cart!, { addToCart }]}>{props.children}</myContext.Provider>
}
