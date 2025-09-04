import type { PayloadAction } from '@reduxjs/toolkit';

import type { NavigationGuardSchema } from '../types/NavigationBlocker';

import { GLOBAL_NAVIGATION_PROTECTION } from '@/shared/consts';
import { createSlice } from '@reduxjs/toolkit';

const savedGlobalDisabling =
	typeof window !== 'undefined'
		? window.localStorage.getItem(GLOBAL_NAVIGATION_PROTECTION)
		: null;

const initialGlobalDisabled = savedGlobalDisabling === 'true';

const initialState: NavigationGuardSchema = {
	enabled: !initialGlobalDisabled,
	globalDisabled: initialGlobalDisabled,
	message: initialGlobalDisabled ? '' : 'Подтвердите переход со страницы',
};

export const navigationGuardSlice = createSlice({
	name: 'NavigationBlocker',
	initialState,
	reducers: {
		changeGlobalDisabling: (state, action: PayloadAction<boolean>) => {
			state.globalDisabled = action.payload;
			state.enabled = !action.payload;
			state.message = action.payload
				? ''
				: 'Подтвердите переход со страницы';
		},
		enableNavigationGuard: (state, action: PayloadAction<string>) => {
			state.enabled = !state.globalDisabled;
			state.message = action.payload;
		},
		disableNavigationGuard: (state) => {
			state.enabled = false;
			state.message = '';
		},
	},
});

export const {
	reducer: navigationBlockerReducer,
	actions: navigationBlockerActions,
} = navigationGuardSlice;
