const express = require('express')
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const {formatMessages} = require('./utils/Messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/Users');

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

io.on('connection', socket => {

  socket.on('joinRoom', ({username, room}) => {
    
    const user = userJoin(socket.id, username, room);

    socket.join(user.room)

    socket.emit('message',formatMessages(botName, "Welcome to chat cord..!"));  
    socket.broadcast.to(user.room).emit('message',formatMessages(botName, `${user.username} joined the chat`));

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })

  socket.on('chatMessage', message => {
    const user = getCurrentUser(socket.id);
    formatMessages()
    io.to(user.room).emit('message',formatMessages(user.username, message)) ;
  })
  
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if(user){
      io.to(user.room).emit('message', formatMessages(botName, `${user.username} has left the chat`));
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
  })

})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
