import { SelectChatButton } from '@/entities/Chat';
import { Spinner } from '@heroui/react';

import { useChatsList } from '../api/chatsApi';

export const ChatsList = () => {
	const { data: chatsList, isLoading, isError } = useChatsList();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 overflow-y-auto">
				<p className="text-start text-sm">Диалоги</p>
				<div className="flex items-center justify-center">
					<Spinner />
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col gap-2 overflow-y-auto">
				<p className="text-start text-sm">Диалоги</p>
				<p className="text-italic text-danger w-full text-left text-xs">
					Произошла ошибка во время получения списка диалогов
				</p>
			</div>
		);
	}

	if (!chatsList?.length)
		return (
			<div className="flex flex-col gap-2 overflow-y-auto">
				<p className="text-start text-sm">Диалоги</p>
				<p className="text-italic w-full text-left text-xs">Начните свой первый диалог!</p>
			</div>
		);

	return (
		<div className="flex flex-col gap-2 overflow-y-auto">
			<p className="text-start text-sm">Диалоги</p>
			{chatsList.map((chat) => (
				<SelectChatButton key={chat.chat_id} chat={chat} />
			))}
		</div>
	);
};
