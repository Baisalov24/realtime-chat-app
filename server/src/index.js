import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import Message from "./models/MessageModel.js";  
import Chat from "./models/ChatModel.js";  

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/chats", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("sendMessage", async (data) => {
    const { chatId, content, senderId } = data;
    try {
      const message = await Message.create({
        chat: chatId,
        sender: senderId,
        content,
      });

      io.to(chatId).emit("message", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("createChat", async (participants) => {
    try {
      const chat = await Chat.create({ participants });
      io.emit("chatCreated", chat); 
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId); 
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on("error", (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
