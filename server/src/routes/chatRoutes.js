import express from 'express';

export function chatRoutes(chatStorage) {
    const router = express.Router();

    // GET /api/chats - получить все чаты
    router.get('/chats', (req, res) => {
        try {
            const chats = chatStorage.getAllChats();
            res.json(chats);
        } catch (error) {
            console.error('Ошибка при получении чатов:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    });

    // GET /api/chats/:chatId - получить сообщения конкретного чата
    router.get('/chats/:chatId', (req, res) => {
        try {
            const { chatId } = req.params;
            const messages = chatStorage.getChatMessages(chatId);

            if (messages === null) {
                return res.status(404).json({ error: 'Чат не найден' });
            }

            res.json(messages);
        } catch (error) {
            console.error('Ошибка при получении сообщений:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    });

    // POST /api/chats - создать новый чат
    router.post('/chats', (req, res) => {
        try {
            const { title } = req.body;
            const chat = chatStorage.createChat(title || 'Новый чат');
            res.status(201).json(chat.toJSON());
        } catch (error) {
            console.error('Ошибка при создании чата:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    });

    // PUT /api/chats/:chatId - обновить заголовок чата
    router.put('/chats/:chatId', (req, res) => {
        try {
            const { chatId } = req.params;
            const { title } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'Заголовок чата обязателен' });
            }

            const chat = chatStorage.updateChatTitle(chatId, title);
            res.json(chat.toJSON());
        } catch (error) {
            if (error.message === 'Чат не найден') {
                return res.status(404).json({ error: 'Чат не найден' });
            }
            console.error('Ошибка при обновлении чата:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    });

    // DELETE /api/chats/:chatId - удалить чат
    router.delete('/chats/:chatId', (req, res) => {
        try {
            const { chatId } = req.params;
            const deleted = chatStorage.deleteChat(chatId);

            if (!deleted) {
                return res.status(404).json({ error: 'Чат не найден' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении чата:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    });

    // GET /api/search - поиск чатов
    router.get('/search', (req, res) => {
        try {
            const { search, mode = 'ai' } = req.query;
            const chats = chatStorage.searchChats(search, mode);
            res.json(chats);
        } catch (error) {
            console.error('Ошибка при поиске чатов:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    });



    // POST /api/chats/:chatId/messages - добавить сообщение в чат
    router.post('/chats/:chatId/messages', (req, res) => {
        try {
            const { chatId } = req.params;
            const { author, body, context = [] } = req.body;

            if (!author || !body) {
                return res.status(400).json({ error: 'Автор и текст сообщения обязательны' });
            }

            if (!['user', 'assistant'].includes(author)) {
                return res.status(400).json({ error: 'Автор должен быть "user" или "assistant"' });
            }

            const message = chatStorage.addMessage(chatId, author, body, context);
            res.status(201).json(message);
        } catch (error) {
            if (error.message === 'Чат не найден') {
                return res.status(404).json({ error: 'Чат не найден' });
            }
            console.error('Ошибка при добавлении сообщения:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    });

    return router;
}
