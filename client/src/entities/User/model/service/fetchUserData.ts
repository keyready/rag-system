import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import type { User } from '../types/User';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserData = createAsyncThunk<User, string, ThunkConfig<string>>('user/fetchUserData', async (userId, thunkApi) => {
	const { extra, rejectWithValue } = thunkApi;

	try {
		const response = await extra.api.get<User>(`/user/${userId}`);

		if (!response.data) {
			throw new Error();
		}

		return response.data;
	} catch (e) {
		console.log(e);
		return rejectWithValue('error');
	}
});
