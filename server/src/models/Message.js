import { v4 as uuidv4 } from 'uuid';

export class Message {
    constructor(author, body, context = []) {
        this.id = uuidv4();
        this.author = author; // 'user' или 'assistant'
        this.body = body;
        this.context = context;
        this.createdAt = new Date();
        this.modifiedAt = null;
        this.isLoading = false;
    }

    updateBody(newBody) {
        this.body = newBody;
        this.modifiedAt = new Date();
    }

    setLoading(loading) {
        this.isLoading = loading;
    }

    toJSON() {
        return {
            id: this.id,
            author: this.author,
            body: this.body,
            context: this.context,
            createdAt: this.createdAt,
            modifiedAt: this.modifiedAt,
            isLoading: this.isLoading
        };
    }
}
