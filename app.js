// dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const formatMessage = require('./utils/messages');
const prisma = require('./prisma/client');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// set static file
app.use(express.static(path.join(__dirname, 'public')));

// Bot name
const botName = 'ChatBot';

// Run when client connects
// At the top of your file
const debug = require('debug')('app:socket');

io.on('connection', (socket) => {
  debug('New client connected');
  
  socket.on('joinRoom', async ({ username, room }) => {
    debug(`User ${username} joining room ${room}`);
    try {
      const user = await prisma.user.create({
        data: {
          username,
          room,
          socketId: socket.id
        }
      });
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
      console.error('Database error:', error);
    }
  });

  // When sending messages
  socket.on('chatMessage', async (msg) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          socketId: socket.id
        }
      });
      
      if (user) {
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
      console.error('Database error:', error);
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

// Add this near the top of your file after requiring prisma
prisma.$on('error', (e) => {
  console.error('Prisma Error:', e);
});

// Add this before your server.listen call
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Add this before server.listen
async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit if database connection fails
  }
}

// Update your server.listen
checkDatabaseConnection().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
