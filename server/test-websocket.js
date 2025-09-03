// Простой тест WebSocket соединения
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8000/ws');

ws.on('open', () => {
    console.log('🔌 WebSocket соединение установлено');

    // Тест 1: Отправка сообщения в новый чат
    console.log('📤 Отправляем сообщение в новый чат...');
    ws.send(JSON.stringify({
        message: 'Привет, это тестовое сообщение!',
        context: []
    }));
});

ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📨 Получено сообщение:', message);

    // Если получили chat_created, отправляем второе сообщение в этот чат
    if (message.status === 'chat_created') {
        console.log('📤 Отправляем второе сообщение в созданный чат...');
        ws.send(JSON.stringify({
            message: 'Второе сообщение в том же чате',
            chat_id: message.chat_id,
            context: []
        }));
    }

    // Если получили answer, закрываем соединение
    if (message.status === 'answer') {
        console.log('✅ Тест завершен успешно!');
        ws.close();
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket ошибка:', error);
});

ws.on('close', () => {
    console.log('👋 WebSocket соединение закрыто');
});
