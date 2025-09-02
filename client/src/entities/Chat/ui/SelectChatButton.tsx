import type { Chat } from '../model/types/ChatsList';

import { RoutePath } from '@/shared/config/RouteConfig';
import { Button, cn } from '@heroui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

interface SelectChatButtonProps {
	chat: Chat;
}

export const SelectChatButton = ({ chat }: SelectChatButtonProps) => {
	const navigate = useNavigate();

	const handleChatClick = useCallback((chatId: string) => {
		navigate(RoutePath.chat + chatId);
	}, []);

	return (
		<Button
			className={cn(
				'flex items-center justify-between bg-transparent duration-100',
				'hover:dark:bg-msg-surface hover:bg-gray-300 dark:text-white',
			)}
			key={chat.chat_id}
			onPress={() => handleChatClick(chat.chat_id)}
			size="sm"
		>
			<p className="truncate">{chat.title}</p>
		</Button>
	);
};
