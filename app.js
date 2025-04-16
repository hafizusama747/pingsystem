const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

// Import the routes from 'routes/index.js'
const routes = require('./routes/index');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize socket.io
const io = socketIo(server);

// Middleware to parse JSON bodies for POST requests
app.use(bodyParser.json());  // for parsing application/json

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the directory for views (optional, default is 'views')
app.set('views', __dirname + '/views');  // This is where your EJS templates will be stored

// Use the imported routes for all requests starting with /
app.use('/', routes);

// Event listener for client connections using Socket.IO

// Event listener for client connections using Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);

  // Listen for a "ping" message from the client
  socket.on('ping', (data) => {
    const { uid, sendTime, pingTimeoutId } = data;
    console.log(`Received ping from UID: ${uid} at ${sendTime}`);
    
    // Respond back to the client with a "pong", including sendTime and pingTimeoutId
    socket.emit('pong', { uid, sendTime, pingTimeoutId });
});

  // Listen for a custom "disconnectPlayer" event from the client
  socket.on('disconnectPlayer', () => {
      console.log('Disconnecting player due to high ping...');
      socket.disconnect(true);  // Forcefully disconnect the client
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
