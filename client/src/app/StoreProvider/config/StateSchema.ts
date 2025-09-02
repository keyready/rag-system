import type { MessagesSchema } from '@/entities/Message';
import type { ContextMenuSchema } from '@/widgets/ContextMenu';
import type { NavigationGuardSchema } from '@/widgets/NavigationBlocker';
import type { EnhancedStore, Reducer, ReducersMapObject, UnknownAction } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';

import { rtkApi } from '@/shared/config/api/rtkApi';

export interface StateSchema {
	contextMenu: ContextMenuSchema;
	navigationGuard: NavigationGuardSchema;
	[rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;

	messages?: MessagesSchema;
}

export type StateSchemaKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateSchemaKey, boolean>;
export interface reducerManager {
	getReducerMap: () => ReducersMapObject<StateSchema>;
	reduce: (state: StateSchema | undefined, action: UnknownAction) => StateSchema;
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
