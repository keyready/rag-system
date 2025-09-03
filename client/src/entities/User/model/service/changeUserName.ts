import type { ThunkConfig } from '@/app/StoreProvider/config/StateSchema';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { getUserData } from '../selectors/UserSelectors';
import { userActions } from '../slice/UserSlice';

export const changeUserName = createAsyncThunk<string, string, ThunkConfig<string>>('user/changeUserName', async (newName, thunkApi) => {
	const { extra, rejectWithValue, getState, dispatch } = thunkApi;

	const userId = getUserData(getState())?.id;

	try {
		const response = await extra.api.post<string>(`/user/${userId}/name`, { name: newName });

		if (!response.data) {
			throw new Error();
		}

		dispatch(userActions.setNewName(newName));
		return response.data;
	} catch (e) {
		console.log(e);
		return rejectWithValue('error');
	}
});
