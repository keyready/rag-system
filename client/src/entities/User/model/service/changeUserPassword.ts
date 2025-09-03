import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import { getUserData } from '@/entities/User';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getNewUserPassword, getOldUserPassword } from '../selectors/UserSelectors';

export const changeUserPassword = createAsyncThunk<string, void, ThunkConfig<string>>('user/changeUserPassword', async (_, thunkApi) => {
	const { extra, rejectWithValue, getState } = thunkApi;

	const userId = getUserData(getState())?.id;
	const oldPassword = getOldUserPassword(getState());
	const newPassword = getNewUserPassword(getState());

	try {
		const response = await extra.api.post<string>(`/user/${userId}/password`, {
			oldPassword: oldPassword,
			newPassword: newPassword,
		});

		if (!response.data) {
			throw new Error();
		}

		return response.data;
	} catch (e) {
		console.log(e);
		return rejectWithValue('error');
	}
});
