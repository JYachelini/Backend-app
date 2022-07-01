// Express || Server variables
import express, { Request, Response } from 'express'
import http from 'http'
import { Server as ioServer } from 'socket.io'

// Model
import User from './Models/UserModel'

// Encrypt
import bcrypt from 'bcryptjs'

// Env
import { env } from './config/env'

// Interfaces & Types
import { DatabaseUserInterface, UserInterface } from './Interfaces/UserInterface'
import { mode } from './types/Mode'

// Middlewares
import cors from 'cors'
import passport from 'passport'
import passportLocal from 'passport-local'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { logInvalid, logProductsError, logRoute } from './Middlewares/Logs'

// Routes
import { authentication } from './Routes/Authentication'
import { routerCart } from './Routes/Cart'
import { routerChat } from './Routes/Chat'
import { routerProduct } from './Routes/Products'
import { routerRandom } from './Routes/Random'

// Controllers
import { save as saveMessages } from './Controllers/messages'

// Server Mode
import Server from './server/mode'

// Compression
import compression from 'compression'

// Strategy
const LocalStrategy = passportLocal.Strategy

// Connection to Mongo
import { connectToMongo } from './config/connectMongo'
connectToMongo()

// Path server folder
import path from 'path'

// Path public client
const root = path.join(__dirname, '..', '..', 'client/build')

// Middleware
const app = express()
app.use(express.json())
app.use(cors({ origin: `${env.FRONTEND}`, credentials: true }))
app.use(session({ secret: 'secretcode', resave: true, saveUninitialized: true }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(root))
app.use(logRoute)

// Passport
passport.use(
	new LocalStrategy(async (username: string, password: string, done) => {
		await User.findOne({ username: username })
			.catch((err) => {
				if (err) throw err
			})
			.then((user: DatabaseUserInterface) => {
				if (!user) return done(null, false)
				bcrypt
					.compare(password, user.password)
					.catch((err) => {
						if (err) throw err
					})
					.then((result: boolean) => {
						if (result === true) {
							return done(null, user)
						} else {
							return done(null, false)
						}
					})
			})
	})
)

passport.serializeUser((user: DatabaseUserInterface, cb) => {
	cb(null, user._id)
})

passport.deserializeUser(async (id: string, cb) => {
	await User.findOne({ _id: id })
		.catch((err) => {
			cb(err, false)
		})
		.then((user: DatabaseUserInterface) => {
			const userInformation: UserInterface = {
				username: user.username,
				isAdmin: user.isAdmin,
				id: user._id,
			}
			cb(null, userInformation)
		})
})
// Routes
app.use(authentication)
app.use(routerCart)
app.use(routerChat)
app.use(routerProduct)
app.use(routerRandom)
app.use(logProductsError)


// Desafios

app.get('/info', (req, res) => {
	const info = {
		Arguments: env.arguments,
		OS: env.os,
		NodeVersion: env.NodeVersion,
		MemoryReservedRSS: env.MemoryReservedRSS,
		ExecPath: env.ExecPath,
		ProcessID: env.ProcessID,
		Folder: env.Folder,
	}
	res.send(info)
})

app.get('/infoCompressed', compression(), (req, res) => {
	const info = {
		Arguments: env.arguments,
		OS: env.os,
		NodeVersion: env.NodeVersion,
		MemoryReservedRSS: env.MemoryReservedRSS,
		ExecPath: env.ExecPath,
		ProcessID: env.ProcessID,
		Folder: env.Folder,
	}
	res.send(info)
})

app.get('/*', logInvalid, (req, res) => {
	res.redirect('/')
})

// Socket io
const httpserver = http.createServer(app)

const io = new ioServer(httpserver, {
	cors: {
		origin: 'http://localhost:3000',
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

const PORT: number = env.PORT
const MODE: mode = env.MODE

// Server listener
const server = new Server()
server[MODE](PORT, httpserver)
