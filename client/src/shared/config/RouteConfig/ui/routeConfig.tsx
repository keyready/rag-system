import type { AppRoutesProps } from '../types/routes.types';

import { ChatPage } from '@/pages/ChatPage';
import { LoginPage } from '@/pages/LoginPage';
import { UploadFilesPage } from '@/pages/UploadFilesPage';

import { AppRoutes } from '../types/routes.types';

export const RoutePath: Record<AppRoutes, string> = {
	[AppRoutes.LOGIN]: '/',
	[AppRoutes.UPLOADFILES]: '/upload',
	[AppRoutes.CHAT]: '/c',
	[AppRoutes.WELCOMECHAT]: '/c',

	[AppRoutes.NOT_FOUND]: '*',
};

export const routerConfig: Record<AppRoutes, AppRoutesProps> = {
	[AppRoutes.LOGIN]: {
		path: RoutePath.login,
		element: <LoginPage />,
	},

	[AppRoutes.UPLOADFILES]: {
		path: RoutePath.upload_files,
		element: <UploadFilesPage />,
		authOnly: true,
	},
	[AppRoutes.WELCOMECHAT]: {
		path: RoutePath.chat,
		element: <ChatPage />,
		authOnly: true,
	},
	[AppRoutes.CHAT]: {
		path: RoutePath.chat + `:chat_id`,
		element: <ChatPage />,
		authOnly: true,
	},

	[AppRoutes.NOT_FOUND]: {
		path: RoutePath.not_found,
		element: <LoginPage />,
	},
};
