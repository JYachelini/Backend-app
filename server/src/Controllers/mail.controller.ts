import { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import { logger } from '../server/logs'
import { env } from '../config/env'
import { CartInterface } from '../Interfaces/CartInterface'

const adminMail = {
	mail: env.ADMIN_MAIL,
	password: env.ADMIN_MAIL_PASSWORD,
}

export default class Mailer {
	constructor() {}
	newRegisterMail = async (req: Request, res: Response) => {
		const { username, mail, firstName, lastName, address, age, phone, avatar } = req?.body

		const contentEmail = `
            <h1>New user registed</h1>
			<p>User information</p>
            <ul>
                <li>Username: ${username}</li>
                <li>Email: ${mail}</li>
				<li>Full Name: ${firstName} ${lastName}</li>
				<li>Address: ${address}</li>
				<li>Age: ${age}</li>
				<li>Phone: ${phone}</li>
				<li>Avatar: ${avatar}</li>
            </ul>
			`

		const transporter = nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			secure: false,
			auth: { user: adminMail.mail, pass: adminMail.password },
			tls: {
				rejectUnauthorized: false,
			},
		})

		const info = await transporter.sendMail({
			from: `juliyachelini@gmail.com`,
			to: adminMail.mail + '@inbox.mailtrap.io',
			subject: 'Ecommerce form',
			html: contentEmail,
		})

		logger?.info(`Email sent ${info.messageId}`)

		res ? res.send('success') : null
	}

	newOrderMail = async (req: Request, res: Response) => {
		const { cart, username, mail, address, firstName, lastName, phone } = req?.body
		const products = cart.productos.map((e: any) => ` <li>Nombre: ${e.nombre}</li><li>ID: ${e.id}</li>`)

		const contentEmail = `
            <h1>New order</h1>
			<h3>User information</h3>
            <ul>
                <li>Username: ${username}</li>
                <li>Email: ${mail}</li>
				<li>Full Name: ${firstName} ${lastName}</li>
				<li>Address: ${address}</li>
				<li>Phone: ${phone}</li>
            </ul>
			<h3>Cart information</h3>
            <p>Cart ID: ${cart.id}</p>
			<p>Productos:</p>
			<ul>${products}</ul>
			`

		const transporter = nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			secure: false,
			auth: { user: adminMail.mail, pass: adminMail.password },
			tls: {
				rejectUnauthorized: false,
			},
		})

		const info = await transporter.sendMail({
			from: `juliyachelini@gmail.com`,
			to: adminMail.mail + '@inbox.mailtrap.io',
			subject: 'Ecommerce form',
			html: contentEmail,
		})

		logger?.info(`Email sent ${info.messageId}`)

		res ? res.send('success') : null
	}
}
