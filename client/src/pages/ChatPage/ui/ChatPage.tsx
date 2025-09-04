import { ChatArea } from '@/comp/ChatArea';
import { WelcomeChatScreen } from '@/entities/Chat';
import { useMessagesWithWebSocket } from '@/entities/Message';
import { RoutePath } from '@/shared/config/RouteConfig';
import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { ChatTextarea } from '@/widgets/ChatTextarea';
import { navigationBlockerActions } from '@/widgets/NavigationBlocker';
import { Page } from '@/widgets/Page';
import { Spinner } from '@heroui/react';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

export const ChatPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { chat_id } = useParams<{ chat_id: string }>();

	const { messages, isLoading, isError, isLLMThinking, sendMessage, readyState } = useMessagesWithWebSocket({
		chatId: chat_id,
		onError: (error) => {
			toast(`WebSocket error: ${error}`);
		},
	});

	useEffect(() => {
		if (!chat_id) navigate(RoutePath.welcome_chat);
	}, [chat_id, navigate]);

	useEffect(() => {
		if (isError) {
			navigate(RoutePath.welcome_chat);
		}
	}, [isError, navigate]);

	useEffect(() => {
		if (messages?.length) {
			dispatch(
				navigationBlockerActions.enableNavigationGuard(
					'Если вы покинете страницу, чат-бот перестанет генерировать ответ на Ваш вопрос. Диалог будет сохранен',
				),
			);
		} else {
			dispatch(navigationBlockerActions.disableNavigationGuard());
		}

		return () => {
			dispatch(navigationBlockerActions.disableNavigationGuard());
		};
	}, [dispatch, messages?.length]);

	return (
		<Page>
			<AnimatePresence mode="wait">
				{!isLoading && messages?.length && <ChatArea messages={messages} isLLMThinking={isLLMThinking} />}
				{!isLoading && (isError || !messages?.length) && <WelcomeChatScreen />}
				{isLoading && (
					<div className="flex h-6/8 w-3/4 flex-col items-center justify-center gap-3">
						<Spinner size="lg" />
						<h2 className="text-2xl font-bold">Загрузка чата...</h2>
					</div>
				)}
			</AnimatePresence>
			<ChatTextarea className="absolute bottom-0 w-3/4" sendMessage={sendMessage} isLLMThinking={isLLMThinking} readyState={readyState} />
		</Page>
	);
};
