const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let count = 0;

wss.on('connection', (ws) => {
  ws.send(count); // Send current count on connect

  ws.on('message', (message) => {
    const val = parseInt(message);
    if (!isNaN(val)) {
      count += val;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(count);
        }
      });
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
