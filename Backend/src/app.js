import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import chatRouter from './routes/chat.routes.js'
import cors from 'cors'
import morgan from 'morgan'

const app = express()
app.use(
  cors({
    origin: 'http://localhost:5173', // your frontend URL — NOT "*"
    credentials: true, // must be true
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api/auth', authRouter)
app.use('/api/chats', chatRouter)

export default app
