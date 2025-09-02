import type { Chat, ChatSearchParams } from '../model/types/ChatsList';

import { rtkApi } from '@/shared/config/api/rtkApi';

const fetchChatsApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getChats: build.query<Chat[], void>({
			query: () => ({
				url: '/chats',
			}),
		}),
		getFilteredChats: build.query<Chat[], ChatSearchParams>({
			query: (params) => ({
				url: '/search',
				params,
			}),
		}),
		getChatsMessages: build.query<Chat[], void>({
			query: () => ({
				url: '/chats',
			}),
		}),
	}),
});

export const useChatsList = fetchChatsApi.useGetChatsQuery;
export const useSearchedChats = fetchChatsApi.useGetFilteredChatsQuery;
