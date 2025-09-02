import { ChatArea } from '@/comp/ChatArea';
import { getIsLLMThinking, messagesReducer, useChatMessages } from '@/entities/Message';
import { RoutePath } from '@/shared/config/RouteConfig';
import { DynamicModuleLoader } from '@/shared/utils/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { ChatTextarea } from '@/widgets/ChatTextarea';
import { navigationBlockerActions } from '@/widgets/NavigationBlocker';
import { WelcomeChatScreen } from '@/widgets/WelcomeChatScreen';
import { cn, Spinner } from '@heroui/react';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

export const ChatPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const isLLMThinking = useSelector(getIsLLMThinking);

	const { chat_id } = useParams<{ chat_id: string }>();
	const {
		data: messages,
		isLoading,
		isError,
	} = useChatMessages(chat_id, {
		skip: !chat_id,
	});

	useEffect(() => {
		if (isError) {
			navigate(RoutePath.welcome_chat);
		}
	}, [isError, navigate, dispatch]);

	useEffect(() => {
		if (isLLMThinking) {
			dispatch(
				navigationBlockerActions.enableNavigationGuard(
					'Если вы покинете страницу, чат-бот перестанет генерировать ответ на Ваш вопрос. Диалог будет сохранен',
				),
			);
		}
		return () => {
			dispatch(navigationBlockerActions.disableNavigationGuard());
		};
	}, []);

	return (
		<DynamicModuleLoader reducers={{ messages: messagesReducer }}>
			<div className={cn('relative flex w-full flex-col items-center justify-start gap-10', 'dark:bg-main dark:text-white')}>
				<AnimatePresence mode="wait">
					{!isLoading && chat_id && messages?.length && <ChatArea />}
					{!isLoading && (isError || !messages?.length) && <WelcomeChatScreen />}
					{isLoading && chat_id && (
						<div className="flex h-6/8 w-3/4 flex-col items-center justify-center gap-3">
							<Spinner size="lg" />
							<h2 className="text-2xl font-bold">Загрузка чата...</h2>
						</div>
					)}
				</AnimatePresence>
				<ChatTextarea className="absolute bottom-0 w-3/4" />
			</div>
		</DynamicModuleLoader>
	);
};
