import type { ChatSchema } from '../types/ChatsList';

import { createSlice } from '@reduxjs/toolkit';

import { changeChatTitle } from '../services/changeChatTitle';
import { deleteChat } from '../services/deleteChat';

const initialState: ChatSchema = {
	isTitleChanging: false,
	isChatDeleting: false,
};

export const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(changeChatTitle.pending, (state) => {
				state.isTitleChanging = true;
			})
			.addCase(changeChatTitle.fulfilled, (state) => {
				state.isTitleChanging = false;
			})
			.addCase(changeChatTitle.rejected, (state) => {
				state.isTitleChanging = false;
			})

			.addCase(deleteChat.pending, (state) => {
				state.isChatDeleting = true;
			})
			.addCase(deleteChat.fulfilled, (state) => {
				state.isChatDeleting = false;
			})
			.addCase(deleteChat.rejected, (state) => {
				state.isChatDeleting = false;
			});
	},
});

export const { reducer: chatReducer, actions: chatActions } = chatSlice;
