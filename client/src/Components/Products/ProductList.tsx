import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { ProductInterface } from '../../Interfaces/CartInterface'
import Product from './Product'

export default function ProductList() {
	const [products, setProducts] = useState<ProductInterface[]>()
	useEffect(() => {
		axios.get('/api/productos', { withCredentials: true }).then((res: AxiosResponse) => {
			const filteredProducts: ProductInterface[] = []
			res.data.forEach((product: ProductInterface) => {
				const productInformation = {
					nombre: product.nombre,
					precio: product.precio,
					id: product.id,
					descripcion: product.descripcion,
					url: product.url,
					codigo: product.codigo,
				}
				filteredProducts.push(productInformation)
			})
			setProducts(filteredProducts)
		})
	}, [])
	return (
		<div className='flex m-20 gap-10'>
			{products ? (
				products.map((item: ProductInterface, index: number) => {
					return <Product key={index} product={item} />
				})
			) : (
				<p>Esperando productos</p>
			)}
		</div>
	)
}
