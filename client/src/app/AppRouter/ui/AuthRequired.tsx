import { RoutePath } from '@/shared/config/RouteConfig';
import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

interface RequireAuthProps {
	children: ReactNode;
}
export function AuthRequired({ children }: RequireAuthProps) {
	const location = useLocation();
	const auth = true;

	if (!auth) {
		return <Navigate to={RoutePath.login} state={{ from: location }} replace />;
	}

	return children;
}
