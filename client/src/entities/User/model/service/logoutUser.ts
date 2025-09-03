import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { getRefreshToken, removeTokens } from '@/shared/config/api/helpers';

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


