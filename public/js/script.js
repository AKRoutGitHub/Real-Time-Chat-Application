const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room from URl
const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true,
});

// Update the Socket.IO connection
const socket = io({
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
});

// Add connection status handling
socket.on('connect_error', (error) => {
  console.error('Connection Error:', error);
  // Optionally display an error message to the user
  alert('Connection error. Please refresh the page.');
});

socket.on('connect', () => {
  console.log('Connected to server');
});

// Join chatroom
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
   outputRoomName(room);
   outputUsers(users);
});

// Add room name to DOM
function outputRoomName(room) {
   roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
   userList.innerHTML = users
      .map(user => `<li>${user.username}</li>`)
      .join('');
}

// message from server
socket.on('message', (message) => {
   // console.log(message);
   outputMessage(message);

   // scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e) => {
   e.preventDefault();

   // hit message text
   const msg = e.target.elements.msg.value;

   // emit message to server
   socket.emit('chatMessage', msg);

   // clear input
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();
});

// output msg to DOM
function outputMessage(message) {
   const div = document.createElement('div');
   
   if (message.username === 'chatterbox Bot') {
      if (message.text.toLowerCase().includes('has left')) {
         div.className = 'message leave-message';
      } else if (message.text.toLowerCase().includes('has joined')) {
         div.className = 'message join-message';
      } else {
         div.className = 'message bot-message';
      }
   } else if (message.username === username) {
      div.className = 'message user-message';
   } else {
      div.className = 'message other-message';
   }

   div.innerHTML = `
      <p class="meta">${message.username} <span>${message.time}</span></p>
      <p class="text">${message.text}</p>
   `;

   document.querySelector('.chat-messages').appendChild(div);
}

// Load chat history when joining room
async function loadChatHistory(room) {
  try {
    const response = await fetch(`/api/chat-history/${room}`);
    const messages = await response.json();
    
    messages.forEach(message => {
      outputMessage({
        username: message.username,
        text: message.text,
        time: moment(message.time).format('h:mm a')
      });
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
}

// Add this at the beginning of the file
document.querySelector('.btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = this.getAttribute('href');
    }, 300);
});
