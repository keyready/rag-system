# RAG System Server

Серверная часть RAG системы для хранения диалогов и обработки сообщений пользователя.

## Возможности

- ✅ REST API для управления чатами и сообщениями
- ✅ WebSocket для потоковой передачи ответов
- ✅ Эхо-функциональность с чанками
- ✅ Хранение диалогов в JSON файлах
- ✅ Поиск по чатам
- ✅ CORS поддержка для фронтенда

## Установка

```bash
cd server
npm install
```

## Запуск

### Режим разработки
```bash
npm run dev
```

### Продакшн режим
```bash
npm start
```

Сервер будет доступен по адресу: `http://localhost:8000`

## API Endpoints

### Чаты
- `GET /api/chats` - получить все чаты
- `POST /api/chats` - создать новый чат
- `GET /api/chats/:chatId` - получить сообщения чата
- `PUT /api/chats/:chatId` - обновить заголовок чата
- `DELETE /api/chats/:chatId` - удалить чат

### Поиск
- `GET /api/search?search=query&mode=ai` - поиск чатов

### Сообщения
- `POST /api/chats/:chatId/messages` - добавить сообщение

## WebSocket

WebSocket доступен по адресу: `ws://localhost:8000/ws`

### Типы сообщений

#### От клиента:
```json
{
  "message": "Текст сообщения",
  "chat_id": "uuid",
  "context": []
}
```

Примечание: `chat_id` необязателен. Если не указан, будет создан новый чат.

#### От сервера:
```json
{
  "status": "chat_created",
  "chat_id": "uuid"
}
```

```json
{
  "status": "processing",
  "chat_id": "uuid"
}
```

```json
{
  "status": "stream",
  "chat_id": "uuid",
  "chunk": "часть текста"
}
```

```json
{
  "status": "answer",
  "chat_id": "uuid",
  "answer": "полный ответ",
  "contexts": []
}
```

```json
{
  "status": "error",
  "detail": "описание ошибки"
}
```

## Структура проекта

```
server/
├── src/
│   ├── index.js              # Главный файл сервера
│   ├── models/
│   │   ├── Chat.js           # Модель чата
│   │   └── Message.js        # Модель сообщения
│   ├── routes/
│   │   └── chatRoutes.js     # REST API маршруты
│   ├── storage/
│   │   └── chatStorage.js    # Хранилище чатов
│   └── websocket/
│       └── websocketHandler.js # WebSocket обработчик
├── data/
│   └── chats.json           # Файл с данными чатов
└── package.json
```

## Конфигурация

По умолчанию сервер запускается на порту 8000. Для изменения порта установите переменную окружения:

```bash
PORT=3000 npm start
```
