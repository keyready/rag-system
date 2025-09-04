import { ChatSearch, ChatsList, NewChatButton } from '@/entities/Chat';
import { AccountBar } from '@/entities/User';
import { UploadFilesButton } from '@/widgets/UploadFilesButton';
import { cn, Divider } from '@heroui/react';

export const Sidebar = () => {
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
					</div>
					<Divider />
					<ChatsList />
				</div>
			</div>

			<AccountBar />
		</div>
	);
};
