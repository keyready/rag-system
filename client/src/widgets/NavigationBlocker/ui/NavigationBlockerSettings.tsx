import { GLOBAL_NAVIGATION_PROTECTION } from '@/shared/consts';
import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { cn } from '@heroui/react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { getIsGlobalDisabling } from '../model/selectors/NavigationBlockerSelectors';
import { navigationBlockerActions } from '../model/slice/NavigationBlockerSlice';

export const NavigationBlockerSettings = () => {
	const dispatch = useAppDispatch();

	const isNavBlockerEnabled = useSelector(getIsGlobalDisabling);

	const handleDisableNavGuard = useCallback(() => {
		try {
			localStorage.setItem(GLOBAL_NAVIGATION_PROTECTION, 'true');
		} catch {}
		dispatch(navigationBlockerActions.changeGlobalDisabling(true));
	}, [dispatch]);

	const handleEnableNavGuard = useCallback(() => {
		try {
			localStorage.setItem(GLOBAL_NAVIGATION_PROTECTION, 'false');
		} catch {}
		dispatch(navigationBlockerActions.changeGlobalDisabling(false));
	}, [dispatch]);

	return (
		<div className="flex w-full items-center justify-between">
			<h2>Защита от перехода со страницы</h2>
			<div className="flex gap-2">
				<button
					className={cn(
						'cursor-pointer rounded px-2 py-1 duration-200',
						'dark:bg-content1 dark:text-white',
						isNavBlockerEnabled
							? 'bg-white'
							: 'dark:bg-msg-surface bg-gray-300 dark:text-white',
					)}
					type="button"
					onClick={handleEnableNavGuard}
				>
					Включить
				</button>
				<button
					className={cn(
						'cursor-pointer rounded px-2 py-1 duration-200',
						'dark:bg-content1 dark:text-white',
						isNavBlockerEnabled
							? 'dark:bg-msg-surface bg-gray-300 dark:text-white'
							: 'bg-white',
					)}
					type="button"
					onClick={handleDisableNavGuard}
				>
					Выключить
				</button>
			</div>
		</div>
	);
};
