import { ChatTextarea } from '@/widgets/ChatTextarea';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';

import { E2EEChat } from '../E2EEChat/E2EEChat';

export const E2EEChatComponent = () => {
	const [newMessage, setNewMessage] = useState<{
		message: string;
		contextLength?: number;
	}>({ message: '' });

	const handleChangeNewMessage = useCallback((msg: string, ctx?: number) => {
		setNewMessage({
			message: msg,
			contextLength: ctx,
		});
	}, []);

	return (
		<div className="relative flex h-screen w-full justify-center">
			<AnimatePresence mode="wait">
				<E2EEChat message={newMessage.message} />
				<ChatTextarea
					className="absolute bottom-0 w-3/4"
					sendMessage={handleChangeNewMessage}
				/>
			</AnimatePresence>
		</div>
	);
};
