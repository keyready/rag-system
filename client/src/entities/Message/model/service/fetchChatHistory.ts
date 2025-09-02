import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';
import type { Message } from '@/entities/Message';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchChatHistory = createAsyncThunk<Message[], string, ThunkConfig<string>>('Message/fetchChatHistory', async (chatId, thunkApi) => {
	const { extra, rejectWithValue } = thunkApi;

	try {
		const response = await extra.api.get<{ messages: Message[]; chat_id: string }>(`/chat/${chatId}`);

		if (!response.data) {
			throw new Error();
		}

		return response.data.messages;
	} catch (e) {
		console.log(e);
		return rejectWithValue('error');
	}
});
