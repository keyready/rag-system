import type { ReducersMapObject } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';

import type { StateSchema } from '../config/StateSchema';

import { Provider } from 'react-redux';

import { CreateReduxStore } from '../config/store';

interface StoreProviderProps {
	children: ReactNode;
	initialState?: DeepPartial<StateSchema>;
	lazyReducers?: DeepPartial<ReducersMapObject<StateSchema>>;
}

export const StoreProvider = (props: StoreProviderProps) => {
	const { children, initialState, lazyReducers } = props;

	const store = CreateReduxStore(initialState as StateSchema, lazyReducers as ReducersMapObject<StateSchema>);

	return <Provider store={store}>{children}</Provider>;
};
