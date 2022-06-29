import { logger } from '../server/logs'
import { NextFunction, Request, Response } from 'express'

export const logRoute = (req: Request, res: Response, next: NextFunction) => {
	const { originalUrl, method } = req
	logger?.info(`Route: ${originalUrl}, Method: ${method}`)
	next()
}

export const logProductsError = (err: Error, req: Request, res: Response, next: NextFunction) => {
	logger?.info(`Error with Api Products: ${err.message}`)
	res.status(500).send(`Error with Api Products: ${err.message}`)
    next()
}

export const logInvalid = (req: Request, res: Response, next: NextFunction) => {
	const { originalUrl, method } = req
	logger?.warn(`Route: ${originalUrl}, method: ${method}. Invalid rute`)
	next()
}
