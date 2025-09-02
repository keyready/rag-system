import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';
import { type ReactNode } from 'react';

export interface MenuItem {
	title: string;
	onClick?: () => void;
	type?: 'action' | 'info';
	icon?: ReactNode;
	severity?: string;
}

interface ContextMenuState {
	isOpen: boolean;
	x: number;
	y: number;
	items: MenuItem[];
}

const initialState: ContextMenuState = {
	isOpen: false,
	x: 0,
	y: 0,
	items: [],
};

export const contextMenuSlice = createSlice({
	name: 'contextMenu',
	initialState,
	reducers: {
		openMenu: (state, action: PayloadAction<{ x: number; y: number; items: MenuItem[] }>) => {
			state.isOpen = true;
			state.x = action.payload.x;
			state.y = action.payload.y;
			state.items = action.payload.items;
		},
		closeMenu: (state) => {
			state.isOpen = false;
			state.items = [];
		},
	},
});

export const { openMenu, closeMenu } = contextMenuSlice.actions;
export default contextMenuSlice.reducer;
