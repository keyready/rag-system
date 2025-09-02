import { SEND_MESSAGE_HOTKEY } from '@/shared/consts';
import { cn } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';

export type SendMessageHotkeyTypes = 'Enter' | 'CtrlEnter';

export const SendMessageHotkey = () => {
	const [hotkey, setHotkey] = useState<SendMessageHotkeyTypes>('Enter');

	useEffect(() => {
		const savedMode = localStorage.getItem(SEND_MESSAGE_HOTKEY) || '';
		if (savedMode) {
			setHotkey(savedMode as SendMessageHotkeyTypes);
		} else setHotkey('Enter');
	}, []);

	const handleChangeMode = useCallback((mode: SendMessageHotkeyTypes) => {
		setHotkey(mode);
		localStorage.setItem(SEND_MESSAGE_HOTKEY, mode);
	}, []);

	return (
		<div className="flex w-full items-center justify-between">
			<h2>Отправка сообщений по</h2>
			<div className="flex gap-2">
				<button
					className={cn(
						'cursor-pointer rounded px-2 py-1 duration-200',
						'dark:bg-content1 dark:text-white',
						hotkey === 'Enter' ? 'dark:bg-msg-surface bg-gray-300 dark:text-white' : 'bg-white',
					)}
					type="button"
					onClick={() => handleChangeMode('Enter')}
				>
					Enter
				</button>
				<button
					className={cn(
						'cursor-pointer rounded px-2 py-1 duration-200',
						'dark:bg-content1 dark:text-white',
						hotkey === 'CtrlEnter' ? 'dark:bg-msg-surface bg-gray-300 dark:text-white' : 'bg-white',
					)}
					type="button"
					onClick={() => handleChangeMode('CtrlEnter')}
				>
					Control + Enter
				</button>
			</div>
		</div>
	);
};
