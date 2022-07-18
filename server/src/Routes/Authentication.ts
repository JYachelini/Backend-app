import passport from 'passport'
import { Router } from 'express'
import User from '../Models/UserModel'
import { DatabaseUserInterface, UserInterface } from '../Interfaces/UserInterface'
import bcrypt from 'bcryptjs'
import { isAdministrator } from '../Middlewares/isAdministrator'
import Mailer from '../Controllers/mail.controller'

const Mail = new Mailer()

export const routerAuthentication = Router()

routerAuthentication.route('/register').post(async (req, res) => {
	const { username, password, mail, firstName, lastName, address, age, phone, avatar } = req.body
	const verifyUser: boolean =
		!username ||
		!password ||
		!mail ||
		!firstName ||
		!lastName ||
		!address ||
		!age ||
		!phone ||
		typeof username !== 'string' ||
		typeof password !== 'string' ||
		typeof mail !== 'string' ||
		typeof firstName !== 'string' ||
		typeof lastName !== 'string' ||
		typeof address !== 'string' ||
		typeof age !== 'string' ||
		typeof phone !== 'string'
	if (verifyUser) {
		res.send('invalid credentials')
		return
	}
	const checkMail = await User.findOne({ mail })
		.catch((err) => {
			if (err) throw err
		})
		.then((doc: DatabaseUserInterface) => {
			if (doc) {
				res.send('mail exist')
				return false
			} else return true
		})
	if (checkMail) {
		await User.findOne({ username })
			.catch((err) => {
				if (err) throw err
			})
			.then(async (doc: DatabaseUserInterface) => {
				if (doc) res.send('username exist')
				if (!doc) {
					const hashedPassword = await bcrypt.hash(password, 10)
					const newUser = new User({
						username,
						password: hashedPassword,
						mail,
						firstName,
						lastName,
						address,
						age,
						phone,
						avatar,
					})
					await newUser.save().then(await Mail.newRegisterMail(req, res))
				}
			})
	}
})

routerAuthentication.route('/login').post(passport.authenticate('local'), (req, res) => {
	res.send('success')
})

routerAuthentication.route('/user').get((req, res) => {
	res.send(req.user)
})
routerAuthentication.route('/user/avatar').post(async (req, res) => {
	const { username, urlAvatar } = req.body
	await User.findOneAndUpdate({ username }, { avatar: urlAvatar })
		.catch((err) => {
			if (err) throw err
		})
		.then(() => {
			res.send('success')
		})
})

routerAuthentication.route('/logout').get((req, res, next) => {
	req.logout((err) => {
		if (err) return next(err)
	})
	res.send('success')
})

routerAuthentication.route('/deleteuser').post(isAdministrator, async (req, res) => {
	const { id } = req?.body
	await User.findByIdAndDelete(id).catch((err) => {
		throw err
	})
	res.send('success')
})

routerAuthentication.route('/getallusers').get(isAdministrator, async (req, res) => {
	await User.find({})
		.then((data: DatabaseUserInterface[]) => {
			const filteredUsers: UserInterface[] = []
			data.forEach((user: DatabaseUserInterface) => {
				const userInformation = {
					id: user._id,
					username: user.username,
					mail: user.mail,
					isAdmin: user.isAdmin,
					firstName: user.firstName,
					lastName: user.lastName,
					address: user.address,
					age: user.age,
					phone: user.phone,
					avatar: user.avatar,
				}
				filteredUsers.push(userInformation)
			})
			res.send(filteredUsers)
		})
		.catch((err) => {
			if (err) res.status(400).send('Error getting users')
		})
})
