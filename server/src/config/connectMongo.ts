import mongoose from 'mongoose'
import { logger } from '../server/logs'
import { env } from './env'

// export const connectMongo = async() => {
//     try {
//         const connecting = connect(env.mongoDB)
//         logger?.info(`Worker ${env.ProcessID} connected to Mongo`)
//     } catch (error) {
//         logger?.error(`Error: ${error}`)
//         process.exit(1)
//     }
// }

export const connectToMongo = async () => {
	try {
		const connecting = await mongoose.connect(env.mongoDB)
		logger?.info(`Worker ${env.ProcessID} connected to Mongo`)
	} catch (error) {
		logger?.error(`Error: ${error}`)
		process.exit(1)
	}
}
