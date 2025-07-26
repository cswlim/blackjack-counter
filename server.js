const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ✅ Use a Map to track individual counters
const clientCounts = new Map();

wss.on('connection', (ws) => {
  // Initialize count to 0 for this user
  clientCounts.set(ws, 0);
  ws.send(0); // Send initial count

  ws.on('message', (message) => {
  if (message === "reset") {
    clientCounts.set(ws, 0);
    ws.send(0);
    return;
  }

  const val = parseInt(message);
  if (!isNaN(val)) {
    const current = clientCounts.get(ws) || 0;
    const updated = current + val;
    clientCounts.set(ws, updated);
    ws.send(updated);
  }
});


  ws.on('close', () => {
    clientCounts.delete(ws); // Cleanup on disconnect
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

