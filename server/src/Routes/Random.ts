import { Router } from 'express'
import { fork } from 'child_process'

export const routerRandom = Router()

routerRandom.get('/api/randoms', (req, res) => {
	const randomFork = fork('./src/Controllers/random')
	randomFork.on('message', (result) => {
		randomFork.send(req.body.cant)
		result !== 'start' && res.send(result)
	})
})
