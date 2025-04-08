const prisma = require('../prisma/client');

// join user to chat
async function userJoin(id, username, room) {
   return await prisma.user.create({
      data: {
         socketId: id,
         username,
         room
      }
   });
}

// get current user
async function getCurrentUser(id) {
   return await prisma.user.findUnique({
      where: {
         socketId: id
      }
   });
}

// user leaves chat
async function userLeave(id) {
   return await prisma.user.delete({
      where: {
         socketId: id
      }
   });
}

// get room users
async function getRoomUsers(room) {
   return await prisma.user.findMany({
      where: {
         room: room
      }
   });
}

module.exports = {
   userJoin,
   getCurrentUser,
   userLeave,
   getRoomUsers,
};
