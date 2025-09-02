import type { RouteProps } from 'react-router';

export type AppRoutesProps = RouteProps & {
	authOnly?: boolean;
};

export const AppRoutes = {
	LOGIN: 'login',
	WELCOMECHAT: 'welcome_chat',
	CHAT: 'chat',
	UPLOADFILES: 'upload_files',
	NOT_FOUND: 'not_found',
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
