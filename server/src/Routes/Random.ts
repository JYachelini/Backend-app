import { Request, Response, Router } from 'express'
import { fork } from 'child_process'
import { logProductsError } from '../Middlewares/Logs'

export const routerRandom = Router()

routerRandom.get('/api/randoms', (req: Request, res: Response) => {
	const randomFork = fork('./Controllers/random')
	randomFork.on('message', (result) => {
		randomFork.send(req.body.cant)
		result !== 'start' && res.send(result)
	})
})


// Error generator
const error = (req: Request, res: Response) => {
	throw new Error('Error random')
}
routerRandom.get('/api/randoms-error', error)
routerRandom.use(logProductsError)
