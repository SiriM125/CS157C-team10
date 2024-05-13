// websocket_server/websocket.mjs
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A client connected!"); 
  socket.on("message", (data) => {
    io.emit("message", data);
  });
});

httpServer.listen(5001, () => {
  console.log('WebSocket server is listening on port 5001');
});