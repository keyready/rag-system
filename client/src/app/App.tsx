import { getIsSessionChecking, getUserData, initUserSession } from '@/entities/User';
import { RoutePath } from '@/shared/config/RouteConfig';
import { AuthorizationLoader } from '@/shared/ui/AuthorizationLoader';
import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { NavigationBlocker } from '@/widgets/NavigationBlocker';
import { Sidebar } from '@/widgets/Sidebar';
import { useTheme } from '@heroui/use-theme';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

export function App() {
	const dispatch = useAppDispatch();
	const isAuth = Boolean(useSelector(getUserData)?.id);
	const isSessionChecking = useSelector(getIsSessionChecking);
	const location = useLocation();

	const { theme: _theme } = useTheme();

	useEffect(() => {
		dispatch(initUserSession());
	}, []);

	if (location.pathname === '/') {
		return <Navigate to={RoutePath.welcome_chat} replace />;
	}

	if (isAuth && location.pathname === RoutePath.login) {
		return <Navigate to={RoutePath.welcome_chat} replace />;
	}

	return (
		<div className="relative flex h-screen font-[Comfortaa] transition-[background-color] duration-200 dark:bg-gray-700 dark:text-white">
			{(isAuth || isSessionChecking) && location.pathname !== RoutePath.login && <Sidebar />}
			<NavigationBlocker />
			<Toaster position="top-left" />
			<Outlet />
			<AuthorizationLoader />
		</div>
	);
}
