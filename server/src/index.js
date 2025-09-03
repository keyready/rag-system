import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import { chatRoutes } from './routes/chatRoutes.js';
import { setupWebSocket } from './websocket/websocketHandler.js';
import { ChatStorage } from './storage/chatStorage.js';

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Инициализируем хранилище чатов
const chatStorage = new ChatStorage();

// Маршруты
app.use('/api', chatRoutes(chatStorage));

// Создаем HTTP сервер
const server = createServer(app);

// Настраиваем WebSocket сервер
const wss = new WebSocketServer({
  server,
  path: '/ws/chat'
});

setupWebSocket(wss, chatStorage);

// Запускаем сервер
server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📡 WebSocket доступен по адресу ws://localhost:${PORT}/ws`);
});

export { chatStorage };
