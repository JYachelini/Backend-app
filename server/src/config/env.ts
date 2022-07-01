import dotenv from 'dotenv'
import * as yargs from 'yargs'

dotenv.config()

// Arguments
const argv: any = yargs.options({
	p: { type: 'number', alias: 'port', default: 8080 },
	m: { type: 'string', alias: 'mode', default: 'fork' },
}).argv

export const env = {
    PORT: argv.p,
    MODE: argv.m,
    NODE_ENV: process.env.NODE_ENV,
    mongoDB: process.env.PART1STRING+process.env.USER!+':'+process.env.PASSWORD+process.env.PART2STRING+process.env.DB+process.env.PART3STRING,
    FRONTEND: process.env.FRONTEND || 'http://localhost:3000',
    arguments: process.argv.slice(2),   // argumentos de entrada
    os: process.platform,               // OS
    NodeVersion: process.version,       // Version node
    MemoryReservedRSS: process.memoryUsage().rss,   // Memoria total reservada
    ExecPath: process.argv[1],          // Path de ejecucuion
    ProcessID: process.pid,             // Process ID
    Folder: process.cwd()               // Carpeta del proyecto
}