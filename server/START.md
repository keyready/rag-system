# 🚀 Быстрый старт сервера

## Установка зависимостей

```bash
cd server
npm install
```

## Запуск сервера

### Режим разработки (с автоперезагрузкой)
```bash
npm run dev
```

### Обычный запуск
```bash
npm start
```

## Проверка работы

После запуска сервер будет доступен по адресу: `http://localhost:8000`

### Тестирование API

1. **Получить все чаты:**
   ```bash
   curl http://localhost:8000/api/chats
   ```

2. **Создать новый чат:**
   ```bash
   curl -X POST http://localhost:8000/api/chats \
     -H "Content-Type: application/json" \
     -d '{"title": "Мой первый чат"}'
   ```

3. **Добавить сообщение:**
   ```bash
   curl -X POST http://localhost:8000/api/chats/{CHAT_ID}/messages \
     -H "Content-Type: application/json" \
     -d '{"author": "user", "body": "Привет!", "context": []}'
   ```

### Тестирование WebSocket

Откройте консоль браузера на странице `http://localhost:8000` и выполните:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => {
  console.log('Соединение установлено');
  
  // Отправить сообщение в новый чат
  ws.send(JSON.stringify({
    message: 'Привет, сервер!',
    context: []
  }));
  
  // Или отправить в существующий чат
  ws.send(JSON.stringify({
    message: 'Второе сообщение',
    chat_id: 'existing-chat-id',
    context: []
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Получено:', data);
};
```

## Структура ответов

### REST API
- Все ответы в формате JSON
- Коды статусов: 200 (OK), 201 (Created), 404 (Not Found), 500 (Server Error)

### WebSocket
- Статусы: `connected`, `chat_created`, `processing`, `stream`, `answer`, `error`
- Потоковая передача чанками по 3 символа
- Эхо-функциональность: сервер возвращает "Эхо: {ваше сообщение}"

## Файлы данных

Чаты сохраняются в файл `data/chats.json` (создается автоматически).

## Логи

Сервер выводит подробные логи в консоль:
- 🔌 WebSocket соединения
- 📨 Входящие сообщения  
- 📂 Загрузка/сохранение данных
- ❌ Ошибки
