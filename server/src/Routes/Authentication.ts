import passport from 'passport'
import { Router } from 'express'
import User from '../Models/UserModel'
import { DatabaseUserInterface, UserInterface } from '../Interfaces/UserInterface'
import bcrypt from 'bcryptjs'
import { isAdministrator } from '../Middlewares/isAdministrator'

export const routerAuthentication = Router()


routerAuthentication.route('/register').post(async (req, res) => {
	const { username, password } = req?.body
	if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
		res.status(400).send('invalid username or password')
		return
	}
	await User.findOne({ username })
		.catch((err) => {
			if (err) throw err
		})
		.then(async (doc: DatabaseUserInterface) => {
			if (doc) res.status(400).send('username exist')
			if (!doc) {
				const hashedPassword = await bcrypt.hash(password, 10)
				const newUser = new User({
					username,
					password: hashedPassword,
				})
				await newUser.save()
				res.send('success')
			}
		})
})

routerAuthentication.route('/login').post(passport.authenticate('local'), (req, res) => {
	res.send('success')
})

routerAuthentication.route('/user').get((req, res) => {
	res.send(req.user)
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
			data.forEach((item: DatabaseUserInterface) => {
				const userInformation = {
					id: item._id,
					username: item.username,
					isAdmin: item.isAdmin,
				}
				filteredUsers.push(userInformation)
			})
			res.send(filteredUsers)
		})
		.catch((err) => {
			if (err) res.status(400).send('Error getting users')
		})
})
