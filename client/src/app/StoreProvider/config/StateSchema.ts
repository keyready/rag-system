import type { UserSchema } from '@/entities/User';
import type { NavigationGuardSchema } from '@/widgets/NavigationBlocker';
import type { EnhancedStore, Reducer, ReducersMapObject, UnknownAction } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';

import { rtkApi } from '@/shared/config/api/rtkApi';

export interface StateSchema {
	navigationGuard: NavigationGuardSchema;
	user: UserSchema;

	[rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;
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
