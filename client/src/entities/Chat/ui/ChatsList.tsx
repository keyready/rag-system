import type { Chat } from '../model/types/ChatsList';

import { SelectChatButton } from '@/entities/Chat';
import { $api } from '@/shared/config/api/api';
import { useEffect, useState } from 'react';

export const ChatsList = () => {
	const [chatsList, setChatsList] = useState<Chat[]>([]);

	useEffect(() => {
		const loadChatsHistory = async () => {
			const { data } = await $api.get<{ chats: Chat[] }>('/chats');
			return data.chats;
		};

		loadChatsHistory().then((res) => setChatsList(res));
	}, []);

	if (!chatsList.length)
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
				<SelectChatButton chat={chat} />
			))}
		</div>
	);
};
