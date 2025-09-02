import type { PayloadAction } from '@reduxjs/toolkit';

import type { Message } from '../types/Message';

import { createSlice } from '@reduxjs/toolkit';

import { fetchChatHistory } from '../service/fetchChatHistory';
import { type MessagesSchema } from '../types/MessagesSchema';

const initialState: MessagesSchema = {
	data: {
		messages: [],
		isLLMThinking: false,
		streamedMessage: '',
		chat_id: '',
	},
	isLoading: false,
	error: undefined,
};

export const messagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		setMessages: (state, action: PayloadAction<Message[]>) => {
			state.data.messages = action.payload;
		},
		setIsLLMThinking: (state, action: PayloadAction<boolean>) => {
			state.data.isLLMThinking = action.payload;
		},
		setStreamedMessage: (state, action: PayloadAction<string | ((prev: string) => string)>) => {
			if (typeof action.payload === 'function') {
				state.data.streamedMessage = action.payload(state.data.streamedMessage);
			} else {
				state.data.streamedMessage = action.payload;
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchChatHistory.pending, (state) => {
			state.isLoading = true;
			state.error = undefined;
		});
		builder.addCase(fetchChatHistory.fulfilled, (state, action: PayloadAction<Message[]>) => {
			state.data.messages = action.payload;
			state.isLoading = false;
			state.error = undefined;
		});
		builder.addCase(fetchChatHistory.rejected, (state) => {
			state.isLoading = false;
			state.error = 'Ошибка загрузки чата';
		});
	},
});

export const { reducer: messagedReducer, actions: messagesActions } = messagesSlice;
