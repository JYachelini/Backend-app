import {env} from './config/env'
import { mode } from './types/Mode'

import httpserver from './server/socket'

// Server Mode
import Server from './server/mode'

const PORT: number = env.PORT
const MODE: mode = env.MODE

// Server listener
const server = new Server()
server[MODE](PORT, httpserver)
