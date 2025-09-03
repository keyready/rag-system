import type { ReducersMapObject } from '@reduxjs/toolkit';

import type { ReduxStoreWithManager, StateSchema } from './StateSchema';

import { userReducer } from '@/entities/User';
import { $api } from '@/shared/config/api/api';
import { rtkApi } from '@/shared/config/api/rtkApi';
import { navigationBlockerReducer } from '@/widgets/NavigationBlocker';
import { configureStore } from '@reduxjs/toolkit';

import { createReducerManager } from './reducerManager';

export function CreateReduxStore(initialState?: StateSchema, lazyReducers?: ReducersMapObject<StateSchema>) {
	const rootReducers: ReducersMapObject<StateSchema> = {
		...lazyReducers,
		navigationGuard: navigationBlockerReducer,
		user: userReducer,

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
