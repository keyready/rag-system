import type { PayloadAction } from '@reduxjs/toolkit';

import type { NavigationGuardSchema } from '../types/NavigationBlocker';

import { createSlice } from '@reduxjs/toolkit';

const initialState: NavigationGuardSchema = {
	enabled: false,
	message: '',
};

export const navigationGuardSlice = createSlice({
	name: 'NavigationBlocker',
	initialState,
	reducers: {
		enableNavigationGuard: (state, action: PayloadAction<string>) => {
			state.enabled = true;
			state.message = action.payload;
		},
		disableNavigationGuard: (state) => {
			state.enabled = false;
			state.message = '';
		},
	},
});

export const { reducer: navigationBlockerReducer, actions: navigationBlockerActions } = navigationGuardSlice;
