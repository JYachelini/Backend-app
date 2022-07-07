import { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import { logger } from '../server/logs'
import { env } from '../config/env'

const adminMail = {
	mail: env.ADMIN_MAIL,
	password: env.ADMIN_MAIL_PASSWORD,
}

export default class Mailer {
	constructor() {}
	sendEmail = async (req: Request, res: Response) => {
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
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false,
			auth: { user: adminMail.mail, pass: adminMail.password },
			tls: {
				rejectUnauthorized: false,
			},
		})

		const info = await transporter.sendMail({
			from: `'Ecommerce test'`,
			to: adminMail.mail,
			subject: 'Ecommerce form',
			html: contentEmail,
		})

		logger?.info(`Email sent ${info.messageId}`)

		res ? res.send('Successful') : null
	}
}
