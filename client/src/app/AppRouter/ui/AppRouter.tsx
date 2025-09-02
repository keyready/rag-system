import { routerConfig } from '@/shared/config/RouteConfig/ui/routeConfig';

import { AuthRequired } from './AuthRequired';

export const AppRouter = Object.values(routerConfig).map((route) => ({
	path: route.path,
	element: route.authOnly ? <AuthRequired>{route.element}</AuthRequired> : route.element,
}));
