import type { ReducersMapObject } from '@reduxjs/toolkit';

import type { StateSchema } from './StateSchema';

import { $api } from '@/shared/config/api/api';
import { configureStore } from '@reduxjs/toolkit';

import contextMenuReducer from '../../store/contextMenuSlice';
import navigationGuardReducer from '../../store/navigationGuardSlice';
import { createReducerManager } from './reducerManager';

export function CreateReduxStore(initialState?: StateSchema, lazyReducers?: ReducersMapObject<StateSchema>) {
	const rootReducers: ReducersMapObject<StateSchema> = {
		...lazyReducers,
		contextMenu: contextMenuReducer,
		navigationGuard: navigationGuardReducer,
	};

	const reducerManager = createReducerManager(rootReducers);

	const store = configureStore({
		// @ts-expect-error лень с типами возиться
		reducer: reducerManager.reduce as ReducersMapObject<StateSchema>,
		devTools: true,
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: {
						api: $api,
					},
				},
			}) /* .concat(rtkApi.middleware) */,
	});

	// @ts-expect-error тут тоже что-то не работает
	store.reducerManager = reducerManager;

	return store;
}

export type AppDispatch = ReturnType<typeof CreateReduxStore>['dispatch'];
