import type { PayloadAction } from '@reduxjs/toolkit';

import type { ContextMenuSchema, MenuItem } from '../types/ContextMenu';

import { createSlice } from '@reduxjs/toolkit';

const initialState: ContextMenuSchema = {
	isOpen: false,
	x: 0,
	y: 0,
	items: [],
};

export const contextMenuSlice = createSlice({
	name: 'ContextMenu',
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
export const { actions: contextMenuActions, reducer: contextMenuReducer } = contextMenuSlice;
