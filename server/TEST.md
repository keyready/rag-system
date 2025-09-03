# 🧪 Тестирование сервера

## Быстрый тест

1. **Запустите сервер:**
   ```bash
   npm run dev
   ```

2. **В другом терминале запустите тест WebSocket:**
   ```bash
   node test-websocket.js
   ```

## Ожидаемый результат

Вы должны увидеть:
```
🔌 WebSocket соединение установлено
📤 Отправляем сообщение в новый чат...
📨 Получено сообщение: { status: 'connected', message: 'Соединение установлено' }
📨 Получено сообщение: { status: 'chat_created', chat_id: '...' }
📤 Отправляем второе сообщение в созданный чат...
📨 Получено сообщение: { status: 'processing', chat_id: '...' }
📨 Получено сообщение: { status: 'stream', chat_id: '...', chunk: 'Эх' }
📨 Получено сообщение: { status: 'stream', chat_id: '...', chunk: 'о: ' }
📨 Получено сообщение: { status: 'stream', chat_id: '...', chunk: 'При' }
... (больше чанков)
📨 Получено сообщение: { status: 'answer', chat_id: '...', answer: 'Эхо: Привет, это тестовое сообщение!', contexts: [] }
✅ Тест завершен успешно!
👋 WebSocket соединение закрыто
```

## Тестирование REST API

```bash
# Получить все чаты
curl http://localhost:8000/api/chats

# Создать новый чат
curl -X POST http://localhost:8000/api/chats \
  -H "Content-Type: application/json" \
  -d '{"title": "Тестовый чат"}'

# Добавить сообщение
curl -X POST http://localhost:8000/api/chats/{CHAT_ID}/messages \
  -H "Content-Type: application/json" \
  -d '{"author": "user", "body": "Тестовое сообщение", "context": []}'
```

## Проверка файлов данных

После тестирования проверьте файл `data/chats.json` - там должны сохраниться созданные чаты и сообщения.
