import { CartInterface } from '../Interfaces/CartInterface'
import twilio from 'twilio'
import { env } from '../config/env'
import { logger } from '../server/logs'
const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_ACCOUNT_TOKEN)

// client.messages.create({
//     to: '+541124049898',
//     from: '+12058437818',
//     body: 'HOLA'
// }).then(message=>console.log(message.sid))

export const test = () => {
	client.messages
		.create({
			to: '+541124049898',
			from: '+12058437818',
			body: 'HOLA',
		})
		.then((message) => console.log(message.sid))
}

export const confirmationOrder = (cart: CartInterface) => {
	const products = cart.productos.map((e: any) => ` <li>Nombre: ${e.nombre}</li><li>ID: ${e.id}</li>`)

	client.messages.create({
		to: '+541124049898',
		from: '+12058437818',
		body: `La orden fue generada exitosamente. Orden: todavíano. ${products}`,
	}).then(message=>logger?.info(`Mensaje de texto enviado, SID: ${message.sid}`))
}
