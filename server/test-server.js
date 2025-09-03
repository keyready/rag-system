// Простой тест для проверки работы сервера
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api';

async function testServer() {
    console.log('🧪 Тестирование сервера...\n');

    try {
        // Тест 1: Получение всех чатов
        console.log('1. Получение всех чатов...');
        const chatsResponse = await fetch(`${BASE_URL}/chats`);
        const chats = await chatsResponse.json();
        console.log('✅ Чаты получены:', chats.length, 'шт.\n');

        // Тест 2: Создание нового чата
        console.log('2. Создание нового чата...');
        const createResponse = await fetch(`${BASE_URL}/chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Тестовый чат' })
        });
        const newChat = await createResponse.json();
        console.log('✅ Чат создан:', newChat.chat_id, '\n');

        // Тест 3: Добавление сообщения
        console.log('3. Добавление сообщения...');
        const messageResponse = await fetch(`${BASE_URL}/chats/${newChat.chat_id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: 'user',
                body: 'Привет, это тестовое сообщение!',
                context: []
            })
        });
        const message = await messageResponse.json();
        console.log('✅ Сообщение добавлено:', message.id, '\n');

        // Тест 4: Получение сообщений чата
        console.log('4. Получение сообщений чата...');
        const messagesResponse = await fetch(`${BASE_URL}/chats/${newChat.chat_id}`);
        const messages = await messagesResponse.json();
        console.log('✅ Сообщения получены:', messages.length, 'шт.\n');

        // Тест 5: Поиск чатов
        console.log('5. Поиск чатов...');
        const searchResponse = await fetch(`${BASE_URL}/search?search=тест&mode=ai`);
        const searchResults = await searchResponse.json();
        console.log('✅ Найдено чатов:', searchResults.length, 'шт.\n');

        console.log('🎉 Все тесты прошли успешно!');

    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error.message);
    }
}

// Запускаем тест только если файл вызван напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
    testServer();
}
