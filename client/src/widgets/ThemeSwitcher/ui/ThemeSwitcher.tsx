import { cn } from '@heroui/react';
import { useTheme } from '@heroui/use-theme';

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex w-full items-center justify-between">
			<h2>Тема</h2>
			<div className="flex gap-2">
				<button
					className={cn(
						'cursor-pointer rounded px-2 py-1 duration-200',
						'dark:bg-content1 dark:text-white',
						theme === 'system' ? 'dark:bg-msg-surface bg-gray-300 dark:text-white' : 'bg-white',
					)}
					type="button"
					onClick={() => setTheme('system')}
				>
					Как в системе
				</button>
				<button
					className={cn(
						'cursor-pointer rounded px-2 py-1 duration-200',
						'dark:bg-content1 dark:text-white',
						theme === 'dark' ? 'dark:bg-msg-surface bg-gray-300 dark:text-white' : 'bg-white',
					)}
					type="button"
					onClick={() => setTheme('dark')}
				>
					Темная
				</button>
				<button
					className={cn(
						'cursor-pointer rounded px-2 py-1 duration-200',
						'dark:bg-content1 dark:text-white',
						theme === 'light' ? 'dark:bg-msg-surface bg-gray-300 dark:text-white' : 'bg-white',
					)}
					type="button"
					onClick={() => setTheme('light')}
				>
					Светлая
				</button>
			</div>
		</div>
	);
}
