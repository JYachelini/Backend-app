import { Router } from 'express'
import { Message } from '../Interfaces/ChatInterface'
import { save as saveMessages, get as getMessages } from '../Controllers/messages'

export const routerChat = Router()

routerChat
	.route('/chat')
	.get(async (req, res) => {
		const messages = await getMessages()
		if (messages.length != 0) {
			res.send(messages)
		} else {
			res.send('Empty chat')
		}
	})
	.post(async (req, res) => {
		const message: Message = req.body
		saveMessages(message)
		res.status(202).json({ OK: 'Mensaje subido' })
	})
