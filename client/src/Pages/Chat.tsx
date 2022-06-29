import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Message } from '../Interfaces/ChatInterface'
import { myContext } from './Context'
const socket = io('http://localhost:8080/')

export default function Chat() {
	const ctx = useContext(myContext)
	const [systemMessage, setSystemMessage] = useState<string>()
	const [messagesList, setMessagesList] = useState<Message[]>([])
	const [newMessage, setNewMessage] = useState<string>()


	const room = 'chatRoom'
	socket.emit('join_room', room)

	const getMessages = () => {
		try {
			axios.get('http://localhost:8080/chat', { withCredentials: true }).then((res) => {
				if (res.data === 'Empty chat') {
					setSystemMessage(res.data)
				} else {
					setMessagesList(res.data)
				}
			})
		} catch (err) {
			throw err
		}
	}

	useEffect(() => {
		getMessages()
		socket.on('receive_message', (data) => {
			setMessagesList((list) => [...list, data])
		})
	}, [socket])

	useEffect(() => {
		const chat: any = document.querySelector('#chat')
		chat!.scrollTop = chat!.scrollTopMax
	}, [messagesList])

	const sendMessage = async (e: any) => {
		e.preventDefault()
		const messageInformation: Message = {
			author: {
				alias: ctx.username!,
			},
			text: newMessage!,
		}
		try {
			if (newMessage) {
				socket.emit('send_message', messageInformation)
				setMessagesList((list) => [...list, messageInformation])
			}
		} catch (err) {
			throw err
		}
	}

	return (
		<>
			<div className='text-center m-10'>
				<h1 className='text-3xl font-bold'>Central de mensajes</h1>

				<div className='text-right border border-rose-500 px-10 pb-10 max-h-[40rem]'>
					<h3 className='text-center'>Bienvenido al chat {ctx.username}!</h3>
					<div id='chat' className='border border-orange-500 max-h-[30rem] overflow-auto flex flex-col gap-2 p-5'>
						{messagesList.length === 0 ? (
							<p>{systemMessage}</p>
						) : (
							messagesList.map((msg, index) => {
								return (
									<div key={index} className={`flex ${ctx.username === msg.author.alias ? 'justify-end' : ''}`}>
										<div className='p-2 max-w-[50%] break-words flex flex-col'>
											<span className={`px-2 ${ctx.username !== msg.author.alias ? 'text-left' : ''}`}>{msg.author.alias}</span>
											<span className='border border-red-500 rounded-xl p-2'>{msg.text}</span>
										</div>
									</div>
								)
							})
						)}
					</div>
					<div className='my-5 flex justify-end gap-5'>
						<input type='text' name='message' placeholder='Type your message' onChange={(e) => setNewMessage(e.target.value)} className='border border-red-500 rounded-xl p-2 w-full' />
						<button onClick={sendMessage} className='border border-red-500 rounded-xl p-2'>
							Enviar
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
