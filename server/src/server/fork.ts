import { config } from "src/config"
import { logger } from "./logs"

process.on('exit', () => {
	logger?.info(`Worker ${process.pid} killed`)
})

process.send!('start')

process.on('message', (PORT) => {
	logger?.info(`Worker ${config.ProcessID} start on port ${PORT} (Fork)`)
})
