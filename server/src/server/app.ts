import express from 'express'

// Middlewares
import cors from 'cors'
import passport from 'passport'
import passportLocal from 'passport-local'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { logInvalid, logProductsError, logRoute } from '../Middlewares/Logs'

// Strategy
const LocalStrategy = passportLocal.Strategy

// Routes
import { routerAuthentication } from '../Routes/Authentication'
import { routerCart } from '../Routes/Cart'
import { routerChat } from '../Routes/Chat'
import { routerProduct } from '../Routes/Products'
import { routerRandom } from '../Routes/Random'


// Compression
import compression from 'compression'

// Encrypt
import bcrypt from 'bcryptjs'

// Interfaces & Types
import { DatabaseUserInterface, UserInterface } from '../Interfaces/UserInterface'

/* MongoDB */

// Connection to Mongo
import { connectToMongo } from '../config/connectMongo'
connectToMongo()

// Models
import User from '../Models/UserModel'

// Enviroments
import { env } from '../config/env'

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

// Path server folder
import path from 'path'

// Path public client
const root = path.join(__dirname, '..', '..', '..', 'client/build')
console.log(root)

const app = express()

app.use(express.json())
app.use(cors({ origin: `${env.FRONTEND}`, credentials: true }))
app.use(session({ secret: 'secretcode', resave: true, saveUninitialized: true }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(root))

// Routes
app.use(routerAuthentication)
app.use(routerCart)
app.use(routerChat)
app.use(routerProduct)
app.use(routerRandom)

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

app.get('/*', (req, res) => {
	res.redirect('/')
})

// Logs
app.use(logRoute)
app.use(logInvalid)
app.use(logProductsError)

export default app
