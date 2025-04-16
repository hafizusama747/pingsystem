const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware for body parsing
app.use(bodyParser.json());

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (e.g., images, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.render('index');
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);

  socket.on('ping', (data) => {
    console.log(`Received ping from UID: ${data.uid}`);

    // Simulate processing delay (optional for testing)
    setTimeout(() => {
      socket.emit('pong', { uid: data.uid, sendTime: data.sendTime, pingTimeoutId: data.pingTimeoutId });
    }, 10);  // Simulated delay of 10ms (optional)
  });

  socket.on('disconnectPlayer', () => {
    console.log(`Disconnecting player: ${socket.id}`);
    socket.disconnect(true); // Disconnect player if needed
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
