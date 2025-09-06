import { E2EEChatComponent } from '@/entities/Chat';
import { RoutePath } from '@/shared/config/RouteConfig';
import { Page } from '@/widgets/Page';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export const ChatPage = () => {
	const navigate = useNavigate();

	const { chat_id } = useParams<{ chat_id: string }>();

	useEffect(() => {
		if (!chat_id) navigate(RoutePath.welcome_chat);
	}, [chat_id, navigate]);

	return (
		<Page>
			<E2EEChatComponent />
		</Page>
	);
};
