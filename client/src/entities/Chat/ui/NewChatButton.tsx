import { RoutePath } from '@/shared/config/RouteConfig';
import { useHotkeys } from '@/shared/utils/useHotkeys';
import { Button, cn } from '@heroui/react';
import { RiPencilLine } from '@remixicon/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export const NewChatButton = () => {
	const navigate = useNavigate();

	const handleNewChatPress = useCallback(() => {
		navigate(RoutePath.welcome_chat);
	}, [navigate]);

	useHotkeys(['control', 'shift', 'o'], handleNewChatPress);

	return (
		<Button
			onPress={handleNewChatPress}
			className={cn(
				'flex items-center justify-between bg-transparent duration-100',
				'hover:dark:bg-msg-surface hover:bg-gray-300 dark:text-white',
			)}
			size="sm"
		>
			<div className="justidy-start flex items-center gap-2">
				<RiPencilLine size={14} />
				<p>Новый чат</p>
			</div>
			<p className="dark:text-sidebar text-gray-200 hover:text-white/80">Ctrl+Shift+O</p>
		</Button>
	);
};
