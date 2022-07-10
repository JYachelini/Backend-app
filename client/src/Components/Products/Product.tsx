import axios from 'axios'
import { useContext, useState } from 'react'
import { myContext } from '../../Pages/Context'

export default function Product({ product }: any) {
	const ctx = useContext(myContext)[0] /* 0 = user */
	const {addToCart} = useContext(myContext)[2] /* 2 = addToCart Function */
	const [edit, setEdit] = useState(false)

	const handleEdit = () => {
		if (edit) {
			setEdit(false)
		} else {
			setEdit(true)
		}
	}

	// Actualizar producto
	const [nombre, setNombre] = useState<string>()
	const [descripcion, setDescripcion] = useState<string>()
	const [precio, setPrecio] = useState<number>()
	const [url, setUrl] = useState<string>()
	const [mensaje, setMensaje] = useState<string>()
	const [mensajeDel, setMensajeDel] = useState<string>()

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		try {
			axios
				.put(
					'/api/productos/',
					{
						nombre: nombre,
						descripcion: descripcion,
						url: url,
						precio: precio,
						id: product.id,
					},
					{ withCredentials: true }
				)
				.then((res) => console.log(res))
		} catch (err) {
			throw err
		}
	}

	const handleDelete = async (e: any) => {
		e.preventDefault()
		try {
			axios.post('/api/productos/delete/',{id:product.id}, {
				withCredentials: true,
			})
			let res = await fetch('/api/productos/', {
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					id: product.id,
				}),
			})
			if (res.status === 202) {
				setMensajeDel('Producto eliminado')
			} else {
				setMensajeDel('Error eliminando el producto')
			}
		} catch (err) {
			console.log(err)
			throw err
		}
	}
	return (
		<>
			<article id={String(product.id)} className='flex flex-col w-64 h-80 border border-red-500 p-2'>
				<div className='items-center border border-rose-500 flex justify-center'>
					<img className='w-auto p-5 h-48' src={product.url} alt={product.nombre} />
				</div>
				<div className='flex flex-col h-[30%]'>
					<span className='text-center text-3xl'>{product.nombre}</span>
					<span className='text-center text-gray-400'>{product.descripcion}</span>
					<span className='text-center text-xl font-bold'>{product.precio}$</span>
				</div>
				<div><button id={product.id} onClick={addToCart}>Agregar</button></div>
				{ctx.isAdmin ? (
					<div>
						<button onClick={handleEdit}>Editar</button>
					</div>
				) : null}
			</article>
			{edit ? (
				<>
					<div className='fixed border border-red-500 left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2'>
						<form onSubmit={handleSubmit} className='flex flex-col'>
							<input type='text' name='nombre' placeholder='nombre' onChange={(e) => setNombre(e.target.value)} />
							<input type='text' name='descripcion' placeholder='descripcion' onChange={(e) => setDescripcion(e.target.value)} />
							<input type='number' name='precio' placeholder='precio' onChange={(e) => setPrecio(Number(e.target.value))} />
							<input type='text' name='url' placeholder='url' onChange={(e) => setUrl(e.target.value)} />
							<button type='submit'>Actualizar producto</button>
						</form>
						<div>{mensaje ? <p>{mensaje}</p> : null}</div>
						<button onClick={handleDelete}>Eliminar producto</button>
						<div>{mensajeDel ? <p>{mensajeDel}</p> : null}</div>
					</div>
				</>
			) : null}
		</>
	)
}
