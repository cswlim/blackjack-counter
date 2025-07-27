const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  let count = 0;
  console.log('New client connected');
  ws.send(count);

  ws.on('message', (message) => {
    console.log("Received message:", message);

    if (message === "reset") {
      count = 0;
      console.log("Reset triggered → count = 0");
      ws.send(count);
      return;
    }

    const val = parseInt(message);
    if (!isNaN(val)) {
      count += val;
      console.log("Updated count:", count);
      ws.send(count);
    }
  });

  ws.on('close', () => {
    console.log("Client disconnected");
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
