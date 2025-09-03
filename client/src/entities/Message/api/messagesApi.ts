import type { Message } from '../model/types/Message';

import { rtkApi } from '@/shared/config/api/rtkApi';

const messagesApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getChatMessages: build.query<Message[], string>({
			query: (chatId) => ({
				url: `/chats/${chatId}`,
			}),
			providesTags: (_, __, chatId) => [
				{ type: 'Messages', id: chatId },
				{ type: 'Messages', id: 'LIST' },
			],
		}),
	}),
});

export const useChatMessages = messagesApi.useGetChatMessagesQuery;
