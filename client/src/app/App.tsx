import { RoutePath } from '@/shared/config/RouteConfig';
import { Sidebar } from '@/widgets/Sidebar';
import { useTheme } from '@heroui/use-theme';
import { Navigate, Outlet, useLocation } from 'react-router';
import { NavigationBlocker } from '@/app/AppRouter/ui/NavigationBlocker';

export function App() {
	const isAuth = true;
	const location = useLocation();

	const { theme: _theme } = useTheme();

	if (isAuth && location.pathname == RoutePath.login) return <Navigate to={RoutePath.upload_files} />;

	return (
		<div className="flex h-screen font-[Comfortaa] transition-[background-color] duration-200 dark:bg-gray-700 dark:text-white">
			{location.pathname !== RoutePath.login && isAuth && <Sidebar />}
			<NavigationBlocker />
			<Outlet />
		</div>
	);
}
