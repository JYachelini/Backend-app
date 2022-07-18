import React, { useContext } from 'react'
import ProductList from '../Components/Products/ProductList'
import { CartInterface } from '../Interfaces/CartInterface'
import { myContext } from './Context'

export default function HomePage() {
	const cart: CartInterface = useContext(myContext)[1] /* 1 = cart */
	const { createOrder } = useContext(myContext)[3] /* 3 = createOrder */
	return (
		<div>
			<ProductList />

			<div className='flex flex-col gap-4'>
				{cart ? (
					<>
						<span className='m-auto'>Productos en carrito:{cart.productos.length}</span>
						<button onClick={createOrder} className='border border-black m-auto p-3'>
							Generar pedido
						</button>
					</>
				) : (
					<>
						<span className='m-auto'>Todavía no hay productos en el carrito</span>
					</>
				)}
			</div>
		</div>
	)
}
