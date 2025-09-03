import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import type { User } from '../types/User';

import { getRefreshToken } from '@/shared/config/api/helpers';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const initUserSession = createAsyncThunk<User | undefined, void, ThunkConfig<string>>('user/initUserSession', async (_: void, thunkApi) => {
	const { rejectWithValue } = thunkApi;

	try {
		if (!getRefreshToken()) {
			return undefined;
		}

		return await new Promise<User | undefined>((resolve) =>
			setTimeout(() => {
				resolve({
					id: '12u3hui1njk-nj123-12nj3km12lk3m-ui3jkql',
					username: 'keyready',
					name: 'Родион',
				});
				// reject();
			}, 1000),
		);
	} catch (e) {
		return rejectWithValue('session_init_error');
	}
});
