import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface NavigationGuardState {
	enabled: boolean;
	message: string;
}

const initialState: NavigationGuardState = {
	enabled: false,
	message: '',
};

export const navigationGuardSlice = createSlice({
	name: 'navigationGuard',
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

export const { enableNavigationGuard, disableNavigationGuard } = navigationGuardSlice.actions;
export default navigationGuardSlice.reducer;
