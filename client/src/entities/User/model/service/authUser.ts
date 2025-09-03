import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import type { UserAuthCredentials, UserTokens } from '../types/User';

import { USER_REF_TOKEN_KEY, USER_TOKEN_KEY } from '@/shared/consts';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const authUser = createAsyncThunk<UserTokens, UserAuthCredentials, ThunkConfig<string>>('user/authUser', async (credentials, thunkApi) => {
	const { extra, rejectWithValue } = thunkApi;

	try {
		const response = await extra.api.post<UserTokens>(`/auth`, credentials);

		if (!response.data) {
			throw new Error();
		}

		localStorage.setItem(USER_REF_TOKEN_KEY, response.data.refreshToken);
		localStorage.setItem(USER_TOKEN_KEY, response.data.accessToken);

		return response.data;
	} catch (e) {
		console.log(e);
		return rejectWithValue('error');
	}
});
