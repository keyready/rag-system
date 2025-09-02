import type { MessageAuthorType, WSMessageStatus } from '@/entities/Message';
import type { SendMessageHotkeyTypes } from '@/widgets/SendMessageHotkey';

import { disableNavigationGuard, enableNavigationGuard } from '@/app/store/navigationGuardSlice';
import { getIsLLMThinking, getMessages, messagesActions } from '@/entities/Message';
import { RoutePath } from '@/shared/config/RouteConfig';
import { SEND_MESSAGE_HOTKEY } from '@/shared/consts';
import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { useWebSocketHandler } from '@/shared/utils/useWebSocketHandler';
import { Button, cn, Popover, PopoverContent, PopoverTrigger, Slider, Textarea } from '@heroui/react';
import { RiErrorWarningLine, RiSendPlaneLine, RiSettings4Line } from '@remixicon/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

interface ChatTextareaProps {
	className?: string;
}

export const ChatTextarea = ({ className }: ChatTextareaProps) => {
	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const { chat_id } = useParams<{ chat_id: string }>();

	const [message, setMessage] = useState<string>('');
	const [contextLength, setContextLength] = useState<number>(3);
	const [_, setErrorDetails] = useState<string>('');

	const isLLMThinking = useSelector(getIsLLMThinking);
	const messages = useSelector(getMessages);

	useEffect(() => {
		dispatch(enableNavigationGuard('Если вы покинете страницу, текущий диалог будет завершен.'));

		return () => {
			dispatch(disableNavigationGuard());
		};
	}, []);

	const { sendJsonMessage } = useWebSocketHandler<WSMessageStatus>({
		url: 'http://localhost:8000/ws/chat',
		handlers: {
			error: (msg) => setErrorDetails(msg.detail ?? 'Unknown error'),
			chat_created: (msg) => navigate(RoutePath.chat + msg.chat_id),
			stream: (msg) => {
				dispatch(messagesActions.setIsLLMThinking(false));
				const chunk = msg.chunk ?? '';
				dispatch(
					messagesActions.setStreamedMessage((prev) => {
						const updated = prev + chunk;
						const last = messages.at(-1);
						let newMessages;
						if (last?.author === 'assistant') {
							newMessages = [...messages.slice(0, -1), { ...last, body: updated }];
						} else {
							newMessages = [
								...messages,
								{
									author: 'assistant' as MessageAuthorType,
									createdAt: new Date(),
									body: updated,
								},
							];
						}
						dispatch(messagesActions.setMessages(newMessages));
						return updated;
					}),
				);
			},
			answer: () => dispatch(messagesActions.setStreamedMessage('')),
		},
	});

	const handleSendMessage = useCallback(async () => {
		sendJsonMessage({
			message,
			...(chat_id ? { chat_id } : {}),
		});
		dispatch(messagesActions.setIsLLMThinking(true));
		const newMessages = [
			...messages,
			{
				author: 'user' as MessageAuthorType,
				createdAt: new Date(),
				body: message.trimEnd(),
			},
		];
		dispatch(messagesActions.setMessages(newMessages));
		setMessage('');
	}, [message, contextLength, dispatch, chat_id, messages]);

	// useEffect(() => {
	// 	switch (lastJsonMessage?.status) {
	// 		case 'error':
	// 			setErrorDetails(lastJsonMessage.detail);
	// 			break;
	// 		case 'chat_created':
	// 			navigate(RoutePath.chat + lastJsonMessage.chat_id, { replace: false });
	// 			break;
	// 		case 'processing':
	// 			break;
	// 		case 'stream': {
	// 			const chunk = lastJsonMessage.chunk;
	// 			dispatch(setIsLLMThinking(false));
	// 			dispatch(setStreamedMessage((prevStreamed) => {
	// 				const updated = prevStreamed + chunk;
	//
	// 				dispatch(setMessages((prevMessages) => {
	// 					const last = prevMessages.at(-1);
	//
	// 					if (last?.author === 'assistant') {
	// 						const updatedMessages = [...prevMessages];
	// 						updatedMessages[updatedMessages.length - 1] = {
	// 							...last,
	// 							body: updated,
	// 						};
	// 						return updatedMessages;
	// 					} else {
	// 						return [
	// 							...prevMessages,
	// 							{
	// 								author: 'assistant',
	// 								createdAt: new Date(),
	// 								body: chunk,
	// 							},
	// 						];
	// 					}
	// 				});
	//
	// 				return updated;
	// 			});
	// 			break;
	// 		}
	// 		case 'answer':
	// 			dispatch(setStreamedMessage(''));
	// 			break;
	// 	}
	// }, [lastJsonMessage, dispatch, setIsLLMThinking]);

	useEffect(() => {
		const handleEnterClick = (event: KeyboardEvent) => {
			if (isLLMThinking || !message) return;

			const selectedSendMode = (localStorage.getItem(SEND_MESSAGE_HOTKEY) || 'Enter') as SendMessageHotkeyTypes;
			if (selectedSendMode === 'Enter') {
				if (event.code === 'Enter') {
					handleSendMessage();
				}
			} else {
				if (event.code === 'Enter' && event.ctrlKey) {
					handleSendMessage();
				}
			}
		};

		document.addEventListener('keydown', handleEnterClick);
		return () => {
			document.removeEventListener('keydown', handleEnterClick);
		};
	}, [isLLMThinking, handleSendMessage]);

	return (
		<div className={cn(className, 'p-4')}>
			<Textarea
				value={message}
				onChange={(ev) => setMessage(ev.target.value)}
				label="Что искать сегодня?"
				endContent={
					<div className="w-10 translate-x-3 -translate-y-1.5">
						<Button
							isDisabled={isLLMThinking || !message}
							onPress={handleSendMessage}
							className="h-fit min-h-0 min-w-0 rounded-none bg-transparent p-0"
						>
							<RiSendPlaneLine />
						</Button>
						<Popover placement="top-end">
							<PopoverTrigger>
								<Button isDisabled={isLLMThinking} className="h-fit min-h-0 min-w-0 rounded-none bg-transparent p-0">
									<RiSettings4Line />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[400px]">
								<AnimatePresence mode="wait">
									{contextLength < 3 && (
										<motion.div
											key="low-context-warning"
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.95 }}
											transition={{ duration: 0.2 }}
										>
											<div className="mb-4 flex items-center gap-3">
												<RiErrorWarningLine size={24} className="text-danger flex-[1_0_auto]" />
												<p className="text-danger">
													При малом количестве контекста ответы будут быстрее, но, скорее всего, менее точныии
												</p>
											</div>
										</motion.div>
									)}
									{contextLength > 10 && (
										<motion.div
											key="high-context-warning"
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.95 }}
											transition={{ duration: 0.2 }}
										>
											<div className="mb-4 flex items-center gap-3">
												<RiErrorWarningLine size={24} className="text-danger flex-[1_0_auto]" />
												<p className="text-danger">При большом количестве контекста ответы будут долгими, но более точными</p>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
								<Slider
									showSteps
									size="sm"
									minValue={2}
									maxValue={20}
									getValue={(val) => `${val} чанка (-ов)`}
									defaultValue={3}
									value={contextLength}
									onChange={(val) => setContextLength(val as unknown as number)}
									label="Количество контекста"
								/>
							</PopoverContent>
						</Popover>
					</div>
				}
			/>
		</div>
	);
};
