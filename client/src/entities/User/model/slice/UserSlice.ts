import type { PayloadAction } from '@reduxjs/toolkit';

import type { User, UserSchema } from '../types/User';

import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

import { authUser } from '../service/authUser';
import { changeUserName } from '../service/changeUserName';
import { changeUserPassword } from '../service/changeUserPassword';
import { fetchUserData } from '../service/fetchUserData';
import { initUserSession } from '../service/initUserSession';
import { logoutUser } from '../service/logoutUser';

const initialState: UserSchema = {
	data: {
		id: '',
		username: '',
		name: '',
	},
	passwordChanging: {
		isPasswordLoading: false,
	},
	isLoading: false,
	isAuthProcessing: false,
	isSessionChecking: false,
	error: undefined,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setNewName: (state, action: PayloadAction<string>) => {
			state.data!.name = action.payload;
		},
		setNewPassword: (state, action: PayloadAction<string>) => {
			state.passwordChanging.newPassword = action.payload;
		},
		setOldPassword: (state, action: PayloadAction<string>) => {
			state.passwordChanging.oldPassword = action.payload;
		},
		setRepeatedPassword: (state, action: PayloadAction<string>) => {
			state.passwordChanging.repeatPassword = action.payload;
		},
		resetPasswords: (state) => {
			state.passwordChanging.newPassword = '';
			state.passwordChanging.oldPassword = '';
			state.passwordChanging.repeatPassword = '';
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(initUserSession.pending, (state) => {
				state.isSessionChecking = true;
			})
			.addCase(initUserSession.fulfilled, (state, action: PayloadAction<User | undefined>) => {
				state.isSessionChecking = false;
				if (action.payload) {
					state.data = action.payload;
				}
			})
			.addCase(initUserSession.rejected, (state) => {
				state.isSessionChecking = false;
				toast.error('Не смогли вас узнать. Повторите вход');
			})
			.addCase(authUser.pending, (state) => {
				state.isAuthProcessing = true;
			})
			.addCase(authUser.fulfilled, (state) => {
				state.isAuthProcessing = false;
			})
			.addCase(authUser.rejected, (state, action) => {
				state.isAuthProcessing = false;
				state.error = action.payload;
				toast.error('Произошла ошибка авторизации');
			})

			.addCase(changeUserPassword.pending, (state) => {
				state.passwordChanging.isPasswordLoading = true;
			})
			.addCase(changeUserPassword.fulfilled, (state) => {
				state.passwordChanging.isPasswordLoading = false;
				toast.success('Пароль успешно изменен');
			})
			.addCase(changeUserPassword.rejected, (state, action) => {
				state.passwordChanging.isPasswordLoading = false;
				state.error = action.payload;

				toast.error('Произошла ошибка во время смены пароля');
			})

			.addCase(changeUserName.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(changeUserName.fulfilled, (state) => {
				state.isLoading = false;
				toast.success('Имя успешно изменено');
			})
			.addCase(changeUserName.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;

				toast.error('Произошла ошибка во время именения имени');
			})

			.addCase(logoutUser.fulfilled, (state) => {
				state.data = undefined;
				toast.success('До скорых встреч!');
			})
			.addCase(logoutUser.rejected, (state) => {
				state.data = undefined;
				toast.success('До скорых встреч!');
			})

			.addCase(fetchUserData.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<User>) => {
				state.isLoading = false;
				state.data = action.payload;
			})
			.addCase(fetchUserData.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export const { reducer: userReducer, actions: userActions } = userSlice;
