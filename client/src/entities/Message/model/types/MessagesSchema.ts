import type { Message } from './Message';

export interface MessagesSchema {
	data: {
		messages: Message[];
		chat_id: string;
		isLLMThinking: boolean;
		streamedMessage: string;
	};
	isLoading: boolean;
	error?: string;
}
