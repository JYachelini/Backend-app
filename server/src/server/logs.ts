import { createLogger, transports, format, addColors, Logger } from 'winston'
import { config } from '../config'
import path from 'path'

const pathLogs = path.join(__dirname, '..', '..', 'Logs')

type logs = Logger | null

const { combine, timestamp, colorize, simple, prettyPrint } = format
const { Console, File } = transports

addColors({
	error: 'redBG',
	warn: 'yellow',
	info: 'green',
})


const buildProdLogs = () => {
	return createLogger({
		level: 'info',
		transports: [
			new File({
				filename: `${pathLogs}/debug.log`,
				level: 'info',
			}),
			new File({
				filename: `${pathLogs}/warn.log`,
				level: 'warn',
			}),
			new File({
				filename: `${pathLogs}/error.log`,
				level: 'error',
			}),
		],
		format: combine(timestamp(), simple(), prettyPrint()),
	})
	
}

const buildDevLogs = () => {
	return createLogger({
		level: 'info',
		transports: [
			new Console({
				level: 'info',
				format: combine(colorize(), simple()),
			}),
			new Console({
				level: 'warn',
				format: combine(colorize(), simple()),
			}),
			new Console({
				level: 'error',
				format: combine(colorize(), simple()),
			})
		],
		format: combine(timestamp(), simple(), prettyPrint()),
	})
}

export let logger: logs = null

if (config.NODE_ENV === 'PROD') {
	logger = buildProdLogs()
} else {
	logger = buildDevLogs()
}