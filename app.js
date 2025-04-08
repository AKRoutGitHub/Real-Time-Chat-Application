// dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const formatMessage = require('./utils/messages');
const prisma = require('./prisma/client');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// set static file
app.use(express.static(path.join(__dirname, 'public')));

// Bot name
const botName = 'ChatBot';

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ username, room }) => {
    try {
      // First try to find if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username
        }
      });

      let user;
      if (existingUser) {
        // Update existing user with new socket ID and room
        user = await prisma.user.update({
          where: { username: username },
          data: {
            socketId: socket.id,
            room: room
          }
        });
      } else {
        // Create new user if doesn't exist
        user = await prisma.user.create({
          data: {
            socketId: socket.id,
            username,
            room
          }
        });
      }

      socket.join(user.room);

      // Welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to ChatterBox! 👋'));

      // Broadcast when a user connects
      socket.broadcast
        .to(room)
        .emit(
          'message',
          formatMessage(botName, `${username} has joined the chat! 🎉`)
        );

      // Send users and room info
      const users = await prisma.user.findMany({
        where: { room }
      });
      
      io.to(room).emit('roomUsers', {
        room,
        users
      });
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });

  // Listen for chatMessage
  socket.on('chatMessage', async (msg) => {
    try {
      const user = await prisma.user.findUnique({
        where: { socketId: socket.id }
      });

      if (user) {
        // Store message in database
        await prisma.message.create({
          data: {
            text: msg,
            username: user.username,
            room: user.room
          }
        });

        io.to(user.room).emit('message', formatMessage(user.username, msg));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Runs when client disconnects
  socket.on('disconnect', async () => {
    try {
      const user = await prisma.user.findUnique({
        where: { socketId: socket.id }
      });

      if (user) {
        await prisma.user.delete({
          where: { socketId: socket.id }
        });

        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat! 👋`)
        );

        // Send users and room info
        const users = await prisma.user.findMany({
          where: { room: user.room }
        });
        
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users
        });
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  });
});

// Add route to fetch chat history
app.get('/api/chat-history/:room', async (req, res) => {
   try {
      const messages = await prisma.message.findMany({
         where: { room: req.params.room },
         orderBy: { time: 'desc' },
         take: 50
      });

      res.json(messages.reverse());
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat history' });
   }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
