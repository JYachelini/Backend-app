import { NextFunction, Request, Response } from 'express'
import { UserInterface } from 'src/Interfaces/UserInterface'
import User from '../Models/UserModel'

export const isAdministrator = async (req: Request, res: Response, next: NextFunction) => {
	const { user }: any = req
	if (user) {
		await User.findOne({ username: user.username })
			.then((doc: UserInterface) => {
				if (doc?.isAdmin) {
					next()
				} else {
					res.send('Invalid permissions')
				}
			})
			.catch((err) => res.status(400).send('Invalid user'))
	} else {
		res.send('You are not logged in')
	}
}