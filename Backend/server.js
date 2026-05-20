 import dotenv from 'dotenv'
 dotenv.config()
import app from './src/app.js'
import http from 'http'
import connectToDB from './src/config/database.js'
// import { testAi } from './src/services/ai.service.js'
import { initSocket } from './src/sockets/server.socket.js'


const httpServer = http.createServer(app)
initSocket(httpServer)
connectToDB()

// testAi()

httpServer.listen(3000, () => {
  console.log('perplexity server is running')
})
