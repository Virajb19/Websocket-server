"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpSocketServer = setUpSocketServer;
function setUpSocketServer(io) {
    io.use((socket, next) => {
        // const { chatId } = socket.handshake.auth
        const chatId = socket.handshake.auth.chatId || socket.handshake.headers.chatid || socket.handshake.query.chatId;
        // console.log('Recieved chatId', chatId)
        if (!chatId) {
            return next(new Error('Invalid chat room'));
        }
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
            if (room !== socket.id) {
                socket.leave(room);
            }
        });
        socket.join(chatId);
        socket.room = chatId;
        next();
    });
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        const chatId = socket.handshake.auth.chatId;
        socket.on('send:message', (msg) => {
            console.log('Message:', msg);
            socket.to(chatId).emit('send:message', msg);
        });
        socket.on('delete:message', (messageId) => {
            console.log(messageId);
            socket.to(chatId).emit('delete:message', messageId);
        });
        socket.on('edit:message', (data) => {
            console.log(data.messageId);
            socket.to(chatId).emit('edit:message', data);
        });
        socket.on('leave:chat', (name, participantId) => {
            socket.to(chatId).emit('leave:chat', name, participantId);
        });
        socket.on('join:chat', (participant) => {
            console.log(participant);
            socket.to(chatId).emit('join:chat', participant);
        });
        socket.on('delete:chat', (name) => {
            socket.to(chatId).emit('delete:chat', name);
        });
        socket.on('user:statusChange', (chatIds, userId) => {
            chatIds.forEach(chatId => {
                socket.to(chatId).emit('user:statusChange', userId);
            });
        });
        socket.on('disconnect', () => console.log('User disconnected:', socket.id));
    });
}
