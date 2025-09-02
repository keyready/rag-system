import type { ReducersMapObject } from '@reduxjs/toolkit';

import type { StateSchema } from './StateSchema';

import { $api } from '@/shared/config/api/api';
import { rtkApi } from '@/shared/config/api/rtkApi';
import { contextMenuReducer } from '@/widgets/ContextMenu';
import { navigationBlockerReducer } from '@/widgets/NavigationBlocker';
import { configureStore } from '@reduxjs/toolkit';

import { createReducerManager } from './reducerManager';
import type { ReduxStoreWithManager } from './StateSchema';

export function CreateReduxStore(initialState?: StateSchema, lazyReducers?: ReducersMapObject<StateSchema>) {
	const rootReducers: ReducersMapObject<StateSchema> = {
		...lazyReducers,
		contextMenu: contextMenuReducer,
		navigationGuard: navigationBlockerReducer,
		[rtkApi.reducerPath]: rtkApi.reducer,
	};

	const reducerManager = createReducerManager(rootReducers);

	const store = configureStore({
		reducer: reducerManager.reduce,
		devTools: true,
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: {
						api: $api,
					},
				},
			}).concat(rtkApi.middleware),
	});

	(store as unknown as ReduxStoreWithManager).reducerManager = reducerManager;

	return store;
}

export type AppDispatch = ReturnType<typeof CreateReduxStore>['dispatch'];
