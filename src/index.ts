import express, { Request, Response} from 'express'
import { Server, Socket } from 'socket.io'
import http from 'http'
import cors from 'cors'
import dotenv from "dotenv";
import { instrument } from '@socket.io/admin-ui'

dotenv.config()

// declare module "socket.io" {
//    interface Handshake {
//       auth: {
//          chatId?: string
//       }
//    }
// }

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: { 
      origin: [process.env.CLIENT_URL as string, "https://admin.socket.io"],
      methods: ["GET", "POST"],
      credentials: true
     },
})

interface CustomSocket extends Socket {
   room?: string
}

export function setUpSocketServer(io: Server) {
      
   io.use((socket: CustomSocket, next) => {
      const { chatId } = socket.handshake.auth
      if(!chatId) {
         return next(new Error('Invalid room'))
      }
      const rooms = Array.from(socket.rooms)
      rooms.forEach(room => {
         if(room !== socket.id) {
            socket.leave(room)
         }
      })
      socket.join(chatId)
      socket.room = chatId
      next()
   })

   io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      const chatId = socket.handshake.auth.chatId as string
      // console.log(chatId)
    
      socket.on('send:message', (msg: any) => {
        console.log('Message:', msg)
        socket.to(chatId).emit('send:message', msg)    
      })
  
      socket.on('delete:message', (messageId: string) => {
         console.log(messageId)
         socket.to(chatId).emit('delete:message', messageId)      
      })
  
      socket.on('edit:message', (data: {messageId: string, newContent: string}) => {
         console.log(data.messageId)
         socket.to(chatId).emit('edit:message', data)
      })
  
      socket.on('leave:chat', (name: string, participantId: string) => {
         socket.to(chatId).emit('leave:chat', name, participantId)
      })
  
      socket.on('join:chat', (participant: any) => { 
         console.log(participant)
        socket.to(chatId).emit('join:chat',participant)
     })
  
     socket.on('delete:chat', (name: string) => {
        socket.to(chatId).emit('delete:chat', name)
     })
    
      socket.on('disconnect', () => console.log('User disconnected:', socket.id))
  })
}

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
