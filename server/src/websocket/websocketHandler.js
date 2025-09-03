import { v4 as uuidv4 } from 'uuid';

export function setupWebSocket(wss, chatStorage) {
    console.log('🔌 WebSocket сервер настроен');

    wss.on('connection', (ws, req) => {
        console.log('👤 Новое WebSocket соединение');

        // Отправляем приветственное сообщение
        ws.send(JSON.stringify({
            status: 'connected',
            message: 'Соединение установлено'
        }));

        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log('📨 Получено сообщение:', message);

                // Проверяем наличие обязательных полей
                if (!message.message) {
                    ws.send(JSON.stringify({
                        status: 'error',
                        detail: 'Поле message обязательно'
                    }));
                    return;
                }

                // Обрабатываем сообщение
                await handleNewMessage(ws, message, chatStorage);
            } catch (error) {
                console.error('❌ Ошибка при обработке WebSocket сообщения:', error);
                ws.send(JSON.stringify({
                    status: 'error',
                    detail: 'Ошибка при обработке сообщения'
                }));
            }
        });

        ws.on('close', () => {
            console.log('👋 WebSocket соединение закрыто');
        });

        ws.on('error', (error) => {
            console.error('❌ WebSocket ошибка:', error);
        });
    });
}

// Обработка нового сообщения
async function handleNewMessage(ws, message, chatStorage) {
    const { chat_id, message: userMessage, context = [] } = message;

    if (!userMessage) {
        ws.send(JSON.stringify({
            status: 'error',
            detail: 'Поле message обязательно'
        }));
        return;
    }

    try {
        let currentChatId = chat_id;

        // Если chat_id не передан, создаем новый чат
        if (!currentChatId) {
            const newChat = chatStorage.createChat('Новый чат');
            currentChatId = newChat.chat_id;

            // Отправляем уведомление о создании нового чата
            ws.send(JSON.stringify({
                status: 'chat_created',
                chat_id: currentChatId
            }));
        } else {
            // Проверяем существование чата
            const existingChat = chatStorage.getChat(currentChatId);
            if (!existingChat) {
                ws.send(JSON.stringify({
                    status: 'error',
                    detail: 'Чат не найден'
                }));
                return;
            }
        }

        // Добавляем сообщение пользователя
        chatStorage.addMessage(currentChatId, 'user', userMessage, context);

        // Отправляем подтверждение о начале обработки
        ws.send(JSON.stringify({
            status: 'processing',
            chat_id: currentChatId
        }));

        // Имитируем эхо-ответ с потоковой передачей
        console.log('Получено сообщение', userMessage);

        await streamEchoResponse(ws, currentChatId, userMessage, chatStorage);

    } catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
        ws.send(JSON.stringify({
            status: 'error',
            detail: 'Ошибка при обработке сообщения'
        }));
    }
}



// Потоковая передача эхо-ответа
async function streamEchoResponse(ws, chatId, userMessage, chatStorage) {
    const echoMessage = `Эхо: ${userMessage}`;
    const chunks = splitIntoChunks(echoMessage, 3); // Разбиваем на чанки по 3 символа

    let fullResponse = '';

    // Отправляем чанки с задержкой
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        fullResponse += chunk;

        // Отправляем чанк
        ws.send(JSON.stringify({
            status: 'stream',
            chat_id: chatId,
            chunk: chunk
        }));

        // Небольшая задержка для имитации обработки
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    }

    // Отправляем финальный ответ
    ws.send(JSON.stringify({
        status: 'answer',
        chat_id: chatId,
        answer: fullResponse,
        contexts: []
    }));

    // Сохраняем ответ ассистента в чат
    try {
        chatStorage.addMessage(chatId, 'assistant', fullResponse, []);
    } catch (error) {
        console.error('Ошибка при сохранении ответа:', error);
    }
}

// Разбиение строки на чанки
function splitIntoChunks(str, chunkSize) {
    const chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
        chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
}
