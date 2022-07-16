import axios from 'axios'
import React, { useContext, useState } from 'react'
import ProductList from '../Components/Products/ProductList'
import { CartInterface } from '../Interfaces/CartInterface'
import { myContext } from './Context'

export default function HomePage() {
	const user = useContext(myContext)[0]
	const cart: CartInterface = useContext(myContext)[1] /* 1 = cart */
	const { createOrder } = useContext(myContext)[3] /* 3 = createOrder */

	const [img, setImg] = useState<string>()
	const test = () => {
		axios.post('/img', { user }, { withCredentials: true }).then((res) => setImg(res.data))
	}
	return (
		<div>
			<ProductList />
			<button onClick={test}>click</button>
			{img ? <img src={img} alt='' /> : null}

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
