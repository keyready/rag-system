# Клиентские запросы: спецификация для Backend API

Ниже перечислены все сетевые вызовы, обнаруженные в клиенте: HTTP (RTK Query/axios) и WebSocket. Форматы тел/ответов собраны из клиентских типов. Используемые базовые URL:

- HTTP (RTK Query): `http://localhost:8000/api`
- HTTP (axios `$api`): `http://localhost:8000`
- WebSocket: `http://localhost:8000/ws/chat`

## Аутентификация

### POST /auth/refresh (axios, вне `/api`)
- **Назначение**: обновление `token` по `refreshToken` при 401.
- **Тело запроса**:
```json
{
  "refreshToken": "string"
}
```
- **Успешный ответ 200**:
```json
{
  "token": "string",
  "refreshToken": "string"
}
```
- **Особенности**: при успехе клиент перезапускает исходный запрос с новым `Authorization: Bearer <token>`.

### Заголовок Authorization
- Для всех запросов через RTK Query и `$api` (axios), если доступен, добавляется заголовок:
```
Authorization: Bearer <token>
```

## Чаты
База для RTK Query: `http://localhost:8000/api`.

### GET /chats
- **Назначение**: получить список чатов пользователя.
- **Ответ 200** — массив `Chat`:
```json
[
  {
    "chat_id": "string",
    "title": "string"
  }
]
```

### GET /search
- **Назначение**: найти чаты по строке и режиму.
- **Параметры query** (`ChatSearchParams`):
  - `search` (string, optional)
  - `mode` ("ai" | "machine", required)
- **Пример**: `/search?mode=ai&search=project`
- **Ответ 200** — массив `Chat` (см. выше).

### GET /chats/{chat_id}
- **Назначение**: получить сообщения одного чата.
- **Ответ 200** — массив `Message`:
```json
[
  {
    "createdAt": "ISO8601 string",
    "author": "assistant" | "user",
    "body": "string",
    "context": ["string"],
    "modifiedAt": "ISO8601 string | null"
  }
]
```
- Примечание: на клиенте `createdAt`/`modifiedAt` — объекты Date, ожидается ISO-строка от сервера.

## WebSocket чат
- URL: `ws://localhost:8000/ws/chat` (в коде указан `http://...`, библиотека сама устанавливает ws-протокол)
- Соединение должно поддерживать авто-переподключение.
- Клиент отправляет и принимает JSON-сообщения.

### Сообщение клиента → сервер
При отправке нового пользовательского сообщения:
```json
{
  "message": "string",           // обязательное, текст пользователя
  "chat_id": "string",           // опционально, если продолжаем существующий чат
  "context_length": 3              // число, опционально, по умолчанию 3
}
```

### Сообщения сервера → клиент
Сервер шлёт объекты со свойством `status`.

1) `chat_created` — создан новый чат
```json
{
  "status": "chat_created",
  "chat_id": "string"
}
```
- Клиент очищает локальное состояние и переходит на маршрут `/chat/{chat_id}`.

2) `processing` — модель начала обработку
```json
{
  "status": "processing",
  "chat_id": "string"
}
```

3) `stream` — потоковая часть ответа ассистента
```json
{
  "status": "stream",
  "chat_id": "string",
  "chunk": "string"
}
```
- Клиент накапливает `chunk` в последнем сообщении ассистента.

4) `answer` — завершённый ответ
```json
{
  "status": "answer",
  "chat_id": "string",
  "answer": "string",
  "contexts": ["string"]
}
```
- Клиент завершает «стриминг», очищает буфер.

5) `error` — ошибка обработки/валидации/сервера
```json
{
  "status": "error",
  "detail": "string"
}
```
- Клиент показывает ошибку и завершает «ожидание».

## Пользователи (заглушки в клиенте)
- `GET /user/{userId}` — ожидается ответ `User`:
```json
{
  "id": "string",
  "username": "string",
  "name": "string"
}
```
- `POST /auth` — ожидается ответ `UserTokens`:
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```
Примечание: сейчас в клиенте авторизация заглушена (имитация `setTimeout`), но ожидаемые форматы указаны для реализации.

## Статусы/коды ошибок
- 401 → клиент автоматически попытается обновить токен через `POST /auth/refresh`.
- 4xx/5xx → клиент пробрасывает ошибки без перехвата (кроме 401), WebSocket — присылает `status:"error"`.

## Требования к CORS/заголовкам
- Ответы должны позволять кросс-доменные запросы с фронтенда на `http://localhost:5173` (Vite), включая заголовок `Authorization`.
- Для WebSocket — разрешить соединение с того же происхождения.
