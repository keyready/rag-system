import type { Message } from '../model/types/Message';

import { rtkApi } from '@/shared/config/api/rtkApi';

const fetchChatMessagesApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getChatsMessages: build.query<Message[], string | undefined>({
			query: (chatId) => ({
				url: `/chats/${chatId}`,
			}),
		}),
	}),
});

export const useChatMessages = fetchChatMessagesApi.useGetChatsMessagesQuery;
