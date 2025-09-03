import type { Message, MessageAuthorType, WSMessageStatus } from '../model/types/Message';

import { RoutePath } from '@/shared/config/RouteConfig';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import useWebSocket from 'react-use-websocket';

import { useChatMessages } from './messagesApi';

interface UseMessagesWithWebSocketOptions {
	chatId?: string;
	onError?: (error: string) => void;
}

export const useMessagesWithWebSocket = ({ chatId, onError }: UseMessagesWithWebSocketOptions) => {
	const navigate = useNavigate();
	const [isLLMThinking, setIsLLMThinking] = useState(false);
	const [streamedMessage, setStreamedMessage] = useState('');
	const [localMessages, setLocalMessages] = useState<Message[]>([]);

	const streamedMessageRef = useRef('');

	// RTK Query для получения сообщений с сервера
	const {
		data: serverMessages = [],
		isLoading,
		isError,
	} = useChatMessages(chatId || '', {
		skip: !chatId,
	});

	// WebSocket connection
	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<WSMessageStatus>('http://localhost:8000/ws/chat', {
		shouldReconnect: () => true,
	});

	// Initialize messages from server and reset local state when chat changes
	useEffect(() => {
		// Reset local messages when chat changes
		setLocalMessages([]);
		setStreamedMessage('');
		streamedMessageRef.current = '';
		setIsLLMThinking(false);
	}, [chatId]);

	useEffect(() => {
		if (serverMessages.length > 0) {
			setLocalMessages(serverMessages);
		}
	}, [serverMessages]);

	// Handle WebSocket messages
	useEffect(() => {
		if (!lastJsonMessage) return;

		switch (lastJsonMessage.status) {
			case 'chat_created':
				// Reset local state when new chat is created
				setLocalMessages([]);
				setStreamedMessage('');
				streamedMessageRef.current = '';
				setIsLLMThinking(false);
				navigate(RoutePath.chat + lastJsonMessage.chat_id);
				break;

			case 'processing':
				setIsLLMThinking(true);
				setStreamedMessage('');
				streamedMessageRef.current = '';
				break;

			case 'stream': {
				setIsLLMThinking(false);
				const chunk = lastJsonMessage.chunk ?? '';
				streamedMessageRef.current += chunk;
				setStreamedMessage(streamedMessageRef.current);

				// Update the last message or create new one
				setLocalMessages((prev) => {
					const last = prev.at(-1);
					if (last?.author === 'assistant') {
						return [...prev.slice(0, -1), { ...last, body: streamedMessageRef.current }];
					} else {
						return [
							...prev,
							{
								author: 'assistant' as MessageAuthorType,
								createdAt: new Date(),
								body: streamedMessageRef.current,
							},
						];
					}
				});
				break;
			}

			case 'answer':
				setStreamedMessage('');
				streamedMessageRef.current = '';
				setIsLLMThinking(false);
				break;

			case 'error':
				setIsLLMThinking(false);
				onError?.(lastJsonMessage.detail);
				break;
		}
	}, [lastJsonMessage, navigate, onError]);

	// Handle WebSocket connection errors
	useEffect(() => {
		if (readyState === 3) {
			onError?.('Не удается установить соединение с сервером');
		}
	}, [readyState, onError]);

	const sendMessage = useCallback(
		(message: string, contextLength: number = 3) => {
			if (!message.trim()) return;

			// Add user message to local state immediately
			const userMessage: Message = {
				author: 'user' as MessageAuthorType,
				createdAt: new Date(),
				body: message.trim(),
			};

			setLocalMessages((prev) => [...prev, userMessage]);
			setIsLLMThinking(true);

			// Send via WebSocket only
			sendJsonMessage({
				message: message.trim(),
				...(chatId ? { chat_id: chatId } : {}),
				context_length: contextLength,
			});
		},
		[chatId, sendJsonMessage],
	);

	return {
		messages: localMessages,
		isLoading,
		isError,
		isLLMThinking,
		streamedMessage,
		sendMessage,
		readyState,
	};
};
