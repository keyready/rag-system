import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import type { UserAuthCredentials, UserTokens } from '../types/User';

import { USER_REF_TOKEN_KEY, USER_TOKEN_KEY } from '@/shared/consts';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const authUser = createAsyncThunk<UserTokens, UserAuthCredentials, ThunkConfig<string>>('user/authUser', async (_credentials, thunkApi) => {
	const { rejectWithValue } = thunkApi;

	try {
		// const response = await extra.api.post<UserTokens>(`/auth`, credentials);
		const response = await new Promise<{ data: UserTokens }>((resolve) =>
			setTimeout(() => {
				resolve({
					data: {
						accessToken: '12u3hui1njk-nj123-12nj3km12lk3m-ui3jkql',
						refreshToken: '12u3hasdnjk-nj1121ew23-12nj3kasdk3m-ui3jkasdasdl',
					},
				});
				// reject();
			}, 1000),
		);

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
