import dotenv from "dotenv";
dotenv.config()
import express, { Request, Response} from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { instrument } from '@socket.io/admin-ui'
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { redis } from './redis'
import { setUpSocketServer } from './socket';

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: { 
      origin: [process.env.CLIENT_URL as string, "https://admin.socket.io"],
      methods: ["GET", "POST"],
      credentials: true
     },
    adapter: createAdapter(redis)
})

setUpSocketServer(io)

instrument(io, {
   auth: false,
   mode: "development",
 });
  
app.use(cors())

app.get('/', (req: Request, res: Response) => {
   res.send('Websocket server is running')
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`))
