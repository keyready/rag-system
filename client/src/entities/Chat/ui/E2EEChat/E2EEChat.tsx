import type { Message } from '@/entities/Message';

import { MessageBlock, useChatMessages } from '@/entities/Message';
import { ScrollShadow, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router';
import useWebSocket from 'react-use-websocket';
import nacl from 'tweetnacl';
import {
	decodeBase64,
	decodeUTF8,
	encodeBase64,
	encodeUTF8,
} from 'tweetnacl-util';

import { WelcomeChatScreen } from '../WelcomeChatScreen';

export const E2EEChat = ({ message }: { message: string }) => {
	const { chat_id } = useParams<{ chat_id: string }>();

	const [messages, setMessages] = useState<Message[]>([]);

	const { isLoading, isError } = useChatMessages(chat_id || '', {
		skip: !chat_id,
	});

	const [keyPair, setKeyPair] = useState<nacl.BoxKeyPair | null>(null);
	const [sharedSecret, setSharedSecret] = useState<Uint8Array | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const [_showScrollButton, setShowScrollButton] = useState(false);

	const scrollBottom = useCallback(() => {
		const container = scrollContainerRef.current;
		if (container) {
			container.scroll({
				top: container.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, []);

	useEffect(() => {
		scrollBottom();
	}, [messages, scrollBottom]);

	useEffect(() => {
		const handleScroll = () => {
			const container = scrollContainerRef.current;
			if (container) {
				const isAtBottom =
					container.scrollHeight - container.scrollTop <=
					container.clientHeight + 100;
				setShowScrollButton(!isAtBottom);
			}
		};

		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
			return () => {
				container.removeEventListener('scroll', handleScroll);
			};
		}
	}, []);

	useEffect(() => {
		const newKeyPair = nacl.box.keyPair();
		setKeyPair(newKeyPair);
	}, []);

	const { sendMessage, lastMessage } = useWebSocket('ws://localhost:8080', {
		onOpen: () => {
			toast.success('Соединение установлено');

			if (keyPair) {
				const initMessage = {
					type: 'init',
					publicKey: encodeBase64(keyPair.publicKey),
				};
				sendMessage(JSON.stringify(initMessage));
			}
		},
		onClose: () => {
			toast.error('Соединение закрыто. Пробую еще раз через 10 сек.');
			setSharedSecret(null);
			setSessionId(null);
		},
		shouldReconnect: () => true,
		reconnectInterval: 5000,
		reconnectAttempts: 5,
		onReconnectStop: (n) =>
			toast.error(
				`Не получилось связаться с сервером (попыток ${n}). Попробуйте позже`,
			),
	});

	useEffect(() => {
		if (lastMessage !== null && keyPair) {
			try {
				const data = JSON.parse(lastMessage.data);

				switch (data.type) {
					case 'session_established': {
						setSessionId(data.sessionId);

						const serverPublicKey = decodeBase64(
							data.serverPublicKey,
						);
						const secret = nacl.box.before(
							serverPublicKey,
							keyPair.secretKey,
						);
						setSharedSecret(secret);

						console.log(
							'Сессия установлена, E2E шифрование активно',
						);
						break;
					}

					case 'chunk': {
						if (!sharedSecret) return;

						const nonce = decodeBase64(data.nonce);
						const encryptedChunk = decodeBase64(data.chunk);
						const decrypted = nacl.secretbox.open(
							encryptedChunk,
							nonce,
							sharedSecret,
						);

						if (decrypted) {
							const chunkText = encodeUTF8(decrypted);

							setMessages((prev) => {
								const lastMessage = prev[prev.length - 1];
								if (
									lastMessage &&
									lastMessage.author === 'assistant' &&
									!lastMessage.isLoading
								) {
									const updatedMessages = [...prev];
									updatedMessages[
										updatedMessages.length - 1
									] = {
										...lastMessage,
										body: lastMessage.body + chunkText,
									};
									return updatedMessages;
								} else {
									return [
										...prev,
										{
											id: Date.now().toString(),
											body: chunkText,
											author: 'assistant',
										},
									];
								}
							});
						}
						break;
					}
					case 'complete':
						setMessages((prev) => {
							const updatedMessages = [...prev];
							const lastAiMessage =
								updatedMessages[updatedMessages.length - 1];
							if (
								lastAiMessage &&
								lastAiMessage.author === 'assistant'
							) {
								lastAiMessage.isLoading = true;
							}
							return updatedMessages;
						});
						break;
				}
			} catch {
				console.error('Ошибка обработки сообщения');
			}
		}
	}, [lastMessage, sharedSecret, keyPair]);

	const sendEncryptedMessage = useCallback(() => {
		if (!message.trim() || !sharedSecret || !sessionId) return;

		const userMessage: Message = {
			createdAt: new Date(),
			id: Date.now().toString(),
			body: message,
			author: 'user' as const,
		};
		setMessages((prev) => [...prev, userMessage]);

		try {
			const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
			const messageBytes = decodeUTF8(message);
			const encrypted = nacl.secretbox(messageBytes, nonce, sharedSecret);

			const payload = {
				type: 'message',
				sessionId: sessionId,
				nonce: encodeBase64(nonce),
				message: encodeBase64(encrypted),
			};

			sendMessage(JSON.stringify(payload));
		} catch (error) {
			console.error('Ошибка шифрования:', error);
		}
	}, [message]);

	useEffect(() => {
		sendEncryptedMessage();
	}, [message]);

	// useEffect(() => {
	// 	if (messages?.length) {
	// 		dispatch(
	// 			navigationBlockerActions.enableNavigationGuard(
	// 				'Если вы покинете страницу, чат-бот перестанет генерировать ответ на Ваш вопрос. Диалог будет сохранен',
	// 			),
	// 		);
	// 	} else {
	// 		dispatch(navigationBlockerActions.disableNavigationGuard());
	// 	}
	//
	// 	return () => {
	// 		dispatch(navigationBlockerActions.disableNavigationGuard());
	// 	};
	// }, [dispatch, messages?.length]);

	if (messages.length && isLoading) {
		return (
			<motion.div
				key="loading-chat"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.5 }}
				className="flex h-6/8 w-3/4 flex-col items-center justify-center gap-3"
			>
				<Spinner size="lg" />
				<h2 className="text-2xl font-bold">Загрузка чата...</h2>
			</motion.div>
		);
	}

	if ((isLoading && (isError || !messages.length)) || !chat_id) {
		return <WelcomeChatScreen />;
	}

	return (
		<motion.div
			key="chat"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex h-7/8 w-9/10 flex-col items-center justify-center"
		>
			<div className="relative h-7/8 w-full">
				<ScrollShadow
					ref={scrollContainerRef}
					id="chat-container"
					style={{
						scrollbarWidth: 'none',
					}}
					className="flex h-full w-full flex-col gap-5 overflow-x-hidden p-10"
				>
					{messages?.map((msg, index) => (
						<MessageBlock message={msg} key={index} />
					))}
				</ScrollShadow>
			</div>
		</motion.div>
	);
};
