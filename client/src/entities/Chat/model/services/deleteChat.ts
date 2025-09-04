import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

export const deleteChat = createAsyncThunk<string, string, ThunkConfig<string>>(
	'chat/deleteChat',
	async (chatId, thunkApi) => {
		const { extra, rejectWithValue } = thunkApi;

		try {
			const response = await extra.api.post<string>(
				`/chat/${chatId}/delete`,
			);

			if (!response.data) {
				throw new Error();
			}

			toast.success('Чат удален');
			return response.data;
		} catch (e) {
			console.log(e);
			toast.error('Ошибка при удалении чата');
			return rejectWithValue('error');
		}
	},
);
