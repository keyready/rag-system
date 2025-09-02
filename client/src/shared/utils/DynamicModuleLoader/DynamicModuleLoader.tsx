import type { ReduxStoreWithManager, StateSchemaKey } from '@/app/StoreProvider/config/StateSchema';
import type { Reducer } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';

import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';

export type ReducersList = {
	[name in StateSchemaKey]?: Reducer;
};

interface DynamicModuleLoaderProps {
	children: ReactNode;
	reducers: ReducersList;
	removeAfterUnmount?: boolean;
}

export const DynamicModuleLoader = (props: DynamicModuleLoaderProps) => {
	const store = useStore() as ReduxStoreWithManager;
	const dispatch = useDispatch();

	const { children, reducers, removeAfterUnmount = true } = props;

	useEffect(() => {
		const mountedReducers = store.reducerManager.getMountedReducers;

		Object.entries(reducers).forEach(([name, reducer]) => {
			// @ts-expect-error что-то сломалось еще 3 года назад
			const mounted = mountedReducers[name as StateSchemaKey];
			if (!mounted) {
				store.reducerManager.add(name as StateSchemaKey, reducer);
				dispatch({ type: `@INIT ${name} reducer` });
			}
		});

		return () => {
			if (removeAfterUnmount) {
				Object.entries(reducers).forEach(([name]) => {
					store.reducerManager.remove(name as StateSchemaKey);
					dispatch({ type: `@DESTROY ${name} reducer` });
				});
			}
		};
	}, []);

	return <>{children}</>;
};
