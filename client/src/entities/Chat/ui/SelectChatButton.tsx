import type { KeyboardEvent } from 'react';

import type { Chat } from '../model/types/ChatsList';

import { RoutePath } from '@/shared/config/RouteConfig';
import { TooltipButton } from '@/shared/ui/TooltipButton';
import { cn, Spinner } from '@heroui/react';
import { RiCheckDoubleLine, RiDeleteBin2Line, RiEdit2Line } from '@remixicon/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';

interface SelectChatButtonProps {
	chat: Chat;
}

export const SelectChatButton = ({ chat }: SelectChatButtonProps) => {
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [isChatNameEditing, setIsChatNameEditing] = useState<boolean>(false);
	const [chatTitle, setChatTitle] = useState<string>(chat.title);
	const [isChatTitleLoading, setIsChatTitleLoading] = useState<boolean>(false);

	const handleChatClick = useCallback(
		(chatId: string) => {
			navigate(RoutePath.chat + chatId);
		},
		[navigate],
	);

	const handleDeleteChat = useCallback(() => {
		toast.success('Удалил чат');
	}, []);

	const handleSaveChanges = useCallback(async () => {
		if (chatTitle.trim() && chatTitle !== chat.title) {
			setIsChatTitleLoading(true);

			try {
				await new Promise((resolve) =>
					setTimeout(() => {
						resolve(true);
					}, 1000),
				);

				toast.success('Название чата изменено');
				return true;
			} catch (_err) {
				toast.error('Ошибка при изменении названия чата');
				return false;
			} finally {
				setIsChatTitleLoading(false);
			}
		}
		return false;
	}, [chatTitle, chat.title]);

	const handleChangeRenameMode = useCallback(async () => {
		if (isChatNameEditing) {
			const success = await handleSaveChanges();
			if (success) {
				setIsChatNameEditing(false);
			}
		} else {
			setIsChatNameEditing(true);
			setTimeout(() => {
				inputRef.current?.focus();
				inputRef.current?.select();
			}, 0);
		}
	}, [isChatNameEditing, handleSaveChanges]);

	const handleCancelEditing = useCallback(() => {
		setChatTitle(chat.title);
		setIsChatNameEditing(false);
		toast('Отмена изменений названия чата');
	}, [chat.title]);

	const handleInputKeyDown = useCallback(
		async (e: KeyboardEvent<HTMLInputElement>) => {
			switch (e.key) {
				case ' ':
					setChatTitle((ps) => ps + ' ');
					e.preventDefault();
					e.stopPropagation();
					break;
				case 'Escape':
					handleCancelEditing();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 'Enter':
					if (!isChatTitleLoading) {
						const success = await handleSaveChanges();
						if (success) {
							setIsChatNameEditing(false);
						}
					}
					e.preventDefault();
					e.stopPropagation();
					break;
			}
		},
		[handleCancelEditing, handleSaveChanges, isChatTitleLoading],
	);

	const handleInputClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
	}, []);

	useEffect(() => {
		const handleClickOutside = async (event: MouseEvent) => {
			if (
				isChatNameEditing &&
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				if (!isChatTitleLoading) {
					const success = await handleSaveChanges();
					if (success) {
						setIsChatNameEditing(false);
					}
				}
			}
		};

		if (isChatNameEditing) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isChatNameEditing, handleSaveChanges, isChatTitleLoading]);

	const renderEditButton = () => (
		<button
			onClick={handleChangeRenameMode}
			className="cursor-pointer"
			disabled={isChatTitleLoading}
		>
			{isChatNameEditing ? (
				isChatTitleLoading ? (
					<Spinner size="sm" />
				) : (
					<RiCheckDoubleLine size={16} className="text-success" />
				)
			) : isChatTitleLoading ? (
				<Spinner size="sm" />
			) : (
				<RiEdit2Line className="opacity-70" size={16} />
			)}
		</button>
	);

	return (
		<div className="w-full overflow-hidden" ref={containerRef}>
			<TooltipButton
				tooltips={
					<div className="flex flex-row-reverse gap-1">
						<button onClick={handleDeleteChat} className="cursor-pointer">
							<RiDeleteBin2Line className="text-danger opacity-70" size={16} />
						</button>
						{renderEditButton()}
					</div>
				}
				onPress={() => handleChatClick(chat.chat_id)}
			>
				<input
					ref={inputRef}
					onKeyDown={handleInputKeyDown}
					onClick={handleInputClick}
					disabled={!isChatNameEditing || isChatTitleLoading}
					className={cn(
						'w-full px-2 py-1 duration-200 focus:outline-none',
						isChatNameEditing
							? 'cursor-text rounded-md bg-gray-200/20'
							: 'cursor-pointer',
						isChatTitleLoading && 'opacity-70',
					)}
					type="text"
					value={chatTitle}
					onChange={(e) => setChatTitle(e.target.value)}
				/>
			</TooltipButton>
		</div>
	);
};
