import { v4 as uuidv4 } from 'uuid';

export class Chat {
    constructor(title = 'Новый чат') {
        this.chat_id = uuidv4();
        this.title = title;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.messages = [];
    }

    addMessage(author, body, context = []) {
        const message = {
            id: uuidv4(),
            author, // 'user' или 'assistant'
            body,
            context,
            createdAt: new Date(),
            modifiedAt: null,
            isLoading: false
        };

        this.messages.push(message);
        this.updatedAt = new Date();

        return message;
    }

    getMessages() {
        return this.messages;
    }

    updateTitle(newTitle) {
        this.title = newTitle;
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            chat_id: this.chat_id,
            title: this.title,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            messagesCount: this.messages.length
        };
    }

    toFullJSON() {
        return {
            chat_id: this.chat_id,
            title: this.title,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            messages: this.messages
        };
    }
}
