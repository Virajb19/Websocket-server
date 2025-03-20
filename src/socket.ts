import { Server, Socket } from 'socket.io'

interface CustomSocket extends Socket {
    room?: string
 }

// declare module "socket.io" {
//    interface Handshake {
//       auth: {
//          chatId?: string
//       }
//    }
// }


export function setUpSocketServer(io: Server) {
      
    io.use((socket: CustomSocket, next) => {
       // const { chatId } = socket.handshake.auth
 
       const chatId = socket.handshake.auth.chatId || socket.handshake.headers.chatid || socket.handshake.query.chatId
 
       // console.log('Recieved chatId', chatId)
 
       if(!chatId) {
          return next(new Error('Invalid chat room'))
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
 
      socket.on('user:statusChange', (chatIds: string[], userId: number) => {
          chatIds.forEach(chatId => {
             socket.to(chatId).emit('user:statusChange', userId)
          })
      })
     
       socket.on('disconnect', () => console.log('User disconnected:', socket.id))
   })
 }
 