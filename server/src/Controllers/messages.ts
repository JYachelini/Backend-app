import { Message } from '../Interfaces/ChatInterface'
import MessageModel from '../Models/MessageModel'

export const save = async (msg: Message) => {
	try {
		const newMsg = new MessageModel(msg)
		newMsg.save()
	} catch (err) {
		console.log(err)
		throw new Error('Error saving the message')
	}
}

export const get = async () : Promise<Message[]>=> {
	try {
		return await MessageModel.find()
	} catch (err) {
		console.log(err)
		throw new Error('Error')
	}
}
