import { getIsSessionChecking, getUserData } from '@/entities/User';
import { RoutePath } from '@/shared/config/RouteConfig';
import { type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';

interface RequireAuthProps {
	children: ReactNode;
}
export function AuthRequired({ children }: RequireAuthProps) {
	const location = useLocation();
	const isAuth = Boolean(useSelector(getUserData)?.id);
	const isSessionChecking = useSelector(getIsSessionChecking);

	if (isSessionChecking) {
		return children;
	}

	if (!isAuth) {
		return <Navigate to={RoutePath.login} state={{ from: location }} replace />;
	}

	return children;
}
