import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import { getRefreshToken, removeTokens } from '@/shared/config/api/helpers';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const logoutUser = createAsyncThunk<void, void, ThunkConfig<string>>('user/logoutUser', async (_, thunkApi) => {
	const { extra, rejectWithValue } = thunkApi;

	try {
		const refreshToken = getRefreshToken();
		if (refreshToken) {
			await extra.api.post<void>('/auth/logout', { refreshToken });
		}

		removeTokens();
		return;
	} catch (e) {
		removeTokens();
		return rejectWithValue('error');
	}
});
