import { env } from "../config/env"
import { logger } from "./logs"

process.on('exit', () => {
	logger?.warn(`Worker ${process.pid} killed`)
})

process.send!('start')

process.on('message', (PORT) => {
	logger?.info(`Worker ${env.ProcessID} start on port ${PORT} (Fork)`)
})
