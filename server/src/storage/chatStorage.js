import { Chat } from '../models/Chat.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ChatStorage {
    constructor() {
        this.chats = new Map();
        this.dataFile = path.join(__dirname, '../../data/chats.json');
        this.loadChats();
    }

    // Создать новый чат
    createChat(title = 'Новый чат') {
        const chat = new Chat(title);
        this.chats.set(chat.chat_id, chat);
        this.saveChats();
        return chat;
    }

    // Получить чат по ID
    getChat(chatId) {
        return this.chats.get(chatId);
    }

    // Получить все чаты
    getAllChats() {
        return Array.from(this.chats.values()).map(chat => chat.toJSON());
    }

    // Получить сообщения чата
    getChatMessages(chatId) {
        const chat = this.chats.get(chatId);
        return chat ? chat.getMessages() : [];
    }

    // Добавить сообщение в чат
    addMessage(chatId, author, body, context = []) {
        const chat = this.chats.get(chatId);
        if (!chat) {
            throw new Error('Чат не найден');
        }

        const message = chat.addMessage(author, body, context);
        this.saveChats();
        return message;
    }

    // Поиск чатов
    searchChats(query, mode = 'ai') {
        const allChats = Array.from(this.chats.values());

        if (!query) {
            return allChats.map(chat => chat.toJSON());
        }

        return allChats
            .filter(chat => {
                if (mode === 'ai') {
                    // Поиск по заголовку и содержимому сообщений
                    const titleMatch = chat.title.toLowerCase().includes(query.toLowerCase());
                    const messageMatch = chat.messages.some(msg =>
                        msg.body.toLowerCase().includes(query.toLowerCase())
                    );
                    return titleMatch || messageMatch;
                } else {
                    // Точный поиск по заголовку
                    return chat.title.toLowerCase().includes(query.toLowerCase());
                }
            })
            .map(chat => chat.toJSON());
    }

    // Обновить заголовок чата
    updateChatTitle(chatId, newTitle) {
        const chat = this.chats.get(chatId);
        if (!chat) {
            throw new Error('Чат не найден');
        }

        chat.updateTitle(newTitle);
        this.saveChats();
        return chat;
    }

    // Удалить чат
    deleteChat(chatId) {
        const deleted = this.chats.delete(chatId);
        if (deleted) {
            this.saveChats();
        }
        return deleted;
    }

    // Загрузить чаты из файла
    async loadChats() {
        try {
            await fs.access(this.dataFile);
            const data = await fs.readFile(this.dataFile, 'utf8');
            const chatsData = JSON.parse(data);

            this.chats.clear();
            chatsData.forEach(chatData => {
                const chat = new Chat(chatData.title);
                chat.chat_id = chatData.chat_id;
                chat.createdAt = new Date(chatData.createdAt);
                chat.updatedAt = new Date(chatData.updatedAt);
                chat.messages = chatData.messages || [];
                this.chats.set(chat.chat_id, chat);
            });

            console.log(`📂 Загружено ${this.chats.size} чатов`);
        } catch (error) {
            console.log('📂 Файл с чатами не найден, создаем новое хранилище');
            await this.ensureDataDirectory();
        }
    }

    // Сохранить чаты в файл
    async saveChats() {
        try {
            await this.ensureDataDirectory();

            const chatsData = Array.from(this.chats.values()).map(chat => ({
                chat_id: chat.chat_id,
                title: chat.title,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
                messages: chat.messages
            }));

            await fs.writeFile(this.dataFile, JSON.stringify(chatsData, null, 2));
        } catch (error) {
            console.error('❌ Ошибка при сохранении чатов:', error);
        }
    }

    // Создать директорию для данных если не существует
    async ensureDataDirectory() {
        const dataDir = path.dirname(this.dataFile);
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
        }
    }
}
