import { ChatSearch, ChatsList, NewChatButton } from '@/entities/Chat';
import { RoutePath } from '@/shared/config/RouteConfig';
import { AccountBar } from '@/widgets/AccountBar';
import { UploadFilesButton } from '@/widgets/UploadFilesButton';
import { Button, cn, Divider } from '@heroui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export const Sidebar = () => {
	const navigate = useNavigate();

	const handleNewChatPress = useCallback(() => {
		navigate(RoutePath.test_page);
	}, [navigate]);

	return (
		<div
			className={cn(
				'relative flex h-screen w-64 max-w-64 flex-[1_0_auto] flex-col items-center justify-between px-4',
				'bg-gray-200 duration-200',
				'dark:bg-sidebar dark:text-white',
			)}
		>
			<div className="flex w-full flex-col items-center">
				<img className="mt-5" src="/logo.png" alt="" />
				<div className="mt-12 flex w-full flex-col gap-4">
					<div className="flex flex-col gap-1">
						<NewChatButton />
						<ChatSearch />
						<UploadFilesButton />
						<Button
							onPress={handleNewChatPress}
							className={cn(
								'flex items-center justify-between bg-transparent duration-100',
								'hover:dark:bg-msg-surface hover:bg-gray-300 dark:text-white',
							)}
							size="sm"
						>
							<div className="justidy-start flex items-center gap-2">
								<p>Тестовая страница</p>
							</div>
							<p className="dark:text-sidebar text-gray-200 hover:text-white/80">Ctrl+Shift+O</p>
						</Button>
					</div>
					<Divider />
					<ChatsList />
				</div>
			</div>

			<AccountBar />
		</div>
	);
};
