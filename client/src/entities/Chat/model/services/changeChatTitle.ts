import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

interface ChangeChatTitleRequest {
	newTitle: string;
	chatId: string;
}

export const changeChatTitle = createAsyncThunk<
	string,
	ChangeChatTitleRequest,
	ThunkConfig<string>
>('chat/changeChatTitle', async ({ newTitle, chatId }, thunkApi) => {
	const { extra, rejectWithValue } = thunkApi;

	try {
		const response = await extra.api.post<string>(`/chat/${chatId}/title`, {
			title: newTitle,
		});

		if (!response.data) {
			throw new Error();
		}

		toast.success('Название чата изменено');
		return response.data;
	} catch (e) {
		console.log(e);
		toast.error('Ошибка при изменении названия чата');
		return rejectWithValue('error');
	}
});
