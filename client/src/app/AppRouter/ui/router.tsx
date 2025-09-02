import { App } from '@/app/App';
import { createBrowserRouter } from 'react-router';

import { AppRouter } from './AppRouter';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: AppRouter,
	},
]);
