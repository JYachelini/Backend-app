import child from 'child_process'
import cluster from 'cluster'
import { cpus } from 'os'
import path from 'path'
import { config } from '../config'
import { logger } from './logs'
const root = path.join(__dirname)

export default class Server {
	constructor() {}

	fork = (PORT: any, server: any) => {
		try {
			const forkServer = child.fork(`${root}/fork`)
			server
				.listen(PORT, () => {
					forkServer.on('message', () => {
						forkServer.send(PORT)
						logger?.info(`Listening from ${server.address().port} - http://localhost:${PORT}`)
					})
				})
				.on('error', (error: Error) => {
					logger?.error(error)
				})
		} catch (err) {
			logger?.error(err)
			throw new Error(err)
		}
	}

	cluster = (PORT: any, server: any) => {
		const numCPUs = cpus().length

		if (cluster.isPrimary) {
			logger?.info(`Workers availables: ${numCPUs}`)
			logger?.info(`Worker Master ${config.ProcessID} initialized`)

			for (let i = 0; i < numCPUs; i++) {
				cluster.fork()
			}
			cluster.on('exit', (worker) => {
				logger?.warn('Worker ', worker.process.pid, ' killed')
				cluster.fork()
			})
		} else {
			logger?.info(`Worker ${config.ProcessID} start on port ${PORT} (Cluster)`)
			server
				.listen(PORT, () => {
					logger?.info(`Listening from ${server.address().port} - http://localhost:${PORT}`)
				})
				.on('error', (error: any) => {
					logger?.error(error)
				})
		}
	}
}
