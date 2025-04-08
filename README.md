# Real-Time Chat Application

A modern, real-time chat application built with Node.js and Socket.IO that allows users to join different chat rooms and communicate instantly.

## Technologies Used

### Backend Technologies
1. **Node.js**
   - Runtime environment for executing JavaScript on the server
   - Handles server-side logic and processing
   - Manages server configuration and routing

2. **Express.js**
   - Web application framework for Node.js
   - Handles HTTP requests and routing
   - Serves static files and manages middleware
   - Provides a robust API for building web applications

3. **Socket.IO**
   - Enables real-time, bidirectional communication between web clients and servers
   - Handles instant message delivery
   - Manages user connections and disconnections
   - Provides event-based communication

### Frontend Technologies
1. **HTML5**
   - Structures the web pages
   - Provides semantic markup for better accessibility
   - Creates the basic layout of the application

2. **CSS3**
   - Styles the application with modern design
   - Implements responsive design for different screen sizes
   - Creates animations and transitions
   - Handles layout and visual presentation

3. **JavaScript (Vanilla)**
   - Manages client-side interactivity
   - Handles DOM manipulation
   - Processes user input and form submissions
   - Manages real-time updates through Socket.IO client

### Additional Libraries
1. **Moment.js**
   - Handles date and time formatting
   - Manages timezone conversions
   - Formats message timestamps


## Features
- Real-time messaging
- Multiple chat rooms
- User join/leave notifications
- Responsive design
- Modern UI with animations
- User list in each room
- Timestamp for messages
- Welcome messages
- Mobile-friendly interface

## Getting Started

1. Write the front-end
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Project Structure
```
├── app.js              # Main server file
├── public/             # Static files
│   ├── css/           # Stylesheets
│   ├── js/            # Client-side JavaScript
│   └── img/           # Images
└── utils/             # Utility functions
    ├── messages.js    # Message formatting
    └── users.js       # User management
```
