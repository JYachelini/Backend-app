import http from 'http'
import { Server as ioServer } from 'socket.io'
import app from './app'

// Controllers
import { save as saveMessages } from '../Controllers/messages'
import { env } from '../config/env'

// Socket io
const httpserver = http.createServer(app)

const io = new ioServer(httpserver, {
	cors: {
		origin: env.FRONTEND,
		methods: ['GET', 'POST'],
	},
})

io.on('connection', (socket) => {
	// console.log(`User Connected: ${socket.id}`)

	socket.on('disconnect', () => {
		// console.log('user disconnected', socket.id)
	})

	socket.on('join_room', (data: string) => {
		socket.join(data)
		// console.log(`user with ID: ${socket.id} connect to room: ${data}`)
	})

	socket.on('send_message', (data) => {
		saveMessages(data)
		socket.to('chatRoom').emit('receive_message', data)
	})
})

export default httpserver