import type { Reducer, ReducersMapObject, UnknownAction } from '@reduxjs/toolkit';

import type { MountedReducers, reducerManager, StateSchema, StateSchemaKey } from './StateSchema';

import { combineReducers } from '@reduxjs/toolkit';

export function createReducerManager(initialReducers: ReducersMapObject<StateSchema>): reducerManager {
	const reducers = { ...initialReducers };
	let combinedReducer = combineReducers(reducers);

	let keysToRemove: StateSchemaKey[] = [];
	const mountedReducers: MountedReducers = {};

	return {
		getReducerMap: () => reducers,
		getMountedReducers: () => mountedReducers,
		reduce: (state: StateSchema | undefined, action: UnknownAction) => {
			if (keysToRemove.length > 0 && state) {
				const newState: StateSchema = { ...state };
				keysToRemove.forEach((key) => {
					delete (newState as any)[key];
				});
				state = newState;
				keysToRemove = [];
			}

			return combinedReducer(state as any, action);
		},
		add: (key: StateSchemaKey, reducer: Reducer) => {
			if (!key || reducers[key]) {
				return;
			}
			reducers[key] = reducer;
			mountedReducers[key] = true;
			combinedReducer = combineReducers(reducers);
		},

		remove: (key: StateSchemaKey) => {
			if (!key || !reducers[key]) {
				return;
			}
			delete reducers[key];
			keysToRemove.push(key);
			mountedReducers[key] = false;
			combinedReducer = combineReducers(reducers);
		},
	};
}
