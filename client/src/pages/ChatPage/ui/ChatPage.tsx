import type { Message } from '@/entities/Message';

import { ChatArea } from '@/comp/ChatArea';
import { getMessages, messagesActions, messagesReducer } from '@/entities/Message';
import { $api } from '@/shared/config/api/api';
import { RoutePath } from '@/shared/config/RouteConfig';
import { DynamicModuleLoader } from '@/shared/utils/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { ChatTextarea } from '@/widgets/ChatTextarea';
import { useFont } from '@/widgets/FontSwitcher';
import { navigationBlockerActions } from '@/widgets/NavigationBlocker';
import { WelcomeChatScreen } from '@/widgets/WelcomeChatScreen';
import { cn, Spinner } from '@heroui/react';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

export const ChatPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { chat_id } = useParams<{ chat_id: string }>();

	const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
	const [selectedFont, setSelectedFont] = useState<string>('!font-[Comfortaa]');

	const { font } = useFont();
	const messages = useSelector(getMessages);

	useEffect(() => {
		setSelectedFont('!font-[' + font + ']');
	}, [font]);

	useEffect(() => {
		dispatch(navigationBlockerActions.enableNavigationGuard('Если вы покинете страницу, текущий диалог будет завершен.'));

		return () => {
			dispatch(navigationBlockerActions.disableNavigationGuard());
		};
	}, []);

	useEffect(() => {
		const getChatHistory = async () => {
			const { data } = await $api.get<{ messages: Message[]; chat_id: string }>(`/chat/${chat_id}`);
			return data.messages;
		};

		const resetChat = () => {
			dispatch(messagesActions.setMessages([]));
			navigate(RoutePath.welcome_chat);
		};

		if (chat_id) {
			setIsChatLoading(true);
			getChatHistory()
				.then((res) => dispatch(messagesActions.setMessages(res)))
				.catch(() => resetChat())
				.finally(() => setIsChatLoading(false));
		} else {
			resetChat();
		}
	}, [chat_id, dispatch, navigate]);

	return (
		<DynamicModuleLoader reducers={{ messages: messagesReducer }}>
			<div className={cn('relative flex w-full flex-col items-center justify-start gap-10', 'dark:bg-main dark:text-white', selectedFont)}>
				<AnimatePresence mode="wait">
					{isChatLoading ? (
						<div className="flex h-6/8 w-3/4 flex-col items-center justify-center gap-3">
							<Spinner size="lg" />
							<h2 className="text-2xl font-bold">Загрузка чата...</h2>
						</div>
					) : messages.length === 0 ? (
						<WelcomeChatScreen />
					) : (
						<ChatArea />
					)}
				</AnimatePresence>

				<ChatTextarea className="absolute bottom-0 w-3/4" />
			</div>
		</DynamicModuleLoader>
	);
};
