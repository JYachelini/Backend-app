export interface ProductInterface {
    id: number
	nombre: string
	descripcion: string
	codigo: string
	url: string
	precio: number
	stock: number
}


export interface CartInterface {
	_id: string
	id: number
	productos: ProductInterface[]
}


