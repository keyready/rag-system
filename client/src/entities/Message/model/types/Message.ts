export type MessageAuthorType = 'assistant' | 'user';

export interface ResponseMessage {
	context: string[];
	message: string;
	chat_id: string;
}

export interface Message {
	createdAt: Date;
	author: MessageAuthorType;
	body: string;
	context?: string[];
	modifiedAt?: Date;
	isLoading?: boolean;
}

export interface ErrorMessage {
	status: 'error';
	detail: string;
}

export interface ChatCreatedMessage {
	status: 'chat_created';
	chat_id: string;
}

export interface ProcessingMessage {
	status: 'processing';
	chat_id: string;
}

export interface StreamMessage {
	status: 'stream';
	chat_id: string;
	chunk: string;
}

export interface AnswerMessage {
	status: 'answer';
	chat_id: string;
	answer: string;
	contexts: string[];
}

export type WSMessageStatus = ErrorMessage | ChatCreatedMessage | ProcessingMessage | StreamMessage | AnswerMessage;
