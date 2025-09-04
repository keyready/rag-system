import { RoutePath } from '@/shared/config/RouteConfig';
import { TooltipButton } from '@/shared/ui/TooltipButton';
import { useHotkeys } from '@/shared/utils/useHotkeys';
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
		<TooltipButton
			tooltips={<p className="text-[10px] opacity-20">Ctrl+Shift+O</p>}
			onPress={handleNewChatPress}
		>
			<div className="justidy-start flex items-center gap-2">
				<RiPencilLine size={14} />
				<p>Новый чат</p>
			</div>
		</TooltipButton>
	);
};
