import type { Message } from '@/entities/Message';
import type { AnyAction, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';

export interface MessagesState {
	messages: Message[];
	isLLMThinking: boolean;
	streamedMessage: string;
}
export interface ContextMenuState {
	isOpen: boolean;
	x: number;
	y: number;
	items: any[]; // Можно типизировать MenuItem, если нужно
}
export interface NavigationGuardState {
	enabled: boolean;
	message: string;
}

export interface StateSchema {
	messages: MessagesState;
	contextMenu: ContextMenuState;
	navigationGuard: NavigationGuardState;
}

export type StateSchemaKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateSchemaKey, boolean>;
export interface reducerManager {
	getReducerMap: () => ReducersMapObject<StateSchema>;
	reduce: (state: StateSchema | undefined, action: AnyAction) => StateSchema;
	add: (key: StateSchemaKey, reducer: Reducer) => void;
	remove: (key: StateSchemaKey) => void;
	getMountedReducers: () => MountedReducers;
}
export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
	reducerManager: reducerManager;
}
export interface ThunkExtraArg {
	api: AxiosInstance;
}
export interface ThunkConfig<T> {
	rejectValue: T;
	extra: ThunkExtraArg;
	state: StateSchema;
}
