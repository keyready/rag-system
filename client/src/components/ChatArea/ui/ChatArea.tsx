import type { Message } from '@/entities/Message';

import { MessageBlock } from '@/entities/Message';
import { TypingLoader } from '@/shared/ui/TypingLoader';
import { ScrollShadow } from '@heroui/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ChatAreaProps {
	messages: Message[];
	isLLMThinking: boolean;
}

export const ChatArea = ({ messages, isLLMThinking }: ChatAreaProps) => {

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const [_showScrollButton, setShowScrollButton] = useState(false);

	const scrollBottom = useCallback(() => {
		const container = scrollContainerRef.current;
		if (container) {
			container.scroll({ top: container.scrollHeight, behavior: 'smooth' });
		}
	}, []);

	useEffect(() => {
		scrollBottom();
	}, [messages, scrollBottom]);

	useEffect(() => {
		const handleScroll = () => {
			const container = scrollContainerRef.current;
			if (container) {
				const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
				setShowScrollButton(!isAtBottom);
			}
		};

		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
			return () => {
				container.removeEventListener('scroll', handleScroll);
			};
		}
	}, []);

	return (
		<motion.div
			key="chat"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex h-7/8 w-9/10 flex-col items-center justify-center"
		>
			<div className="relative h-7/8 w-full">
				<ScrollShadow
					ref={scrollContainerRef}
					id="chat-container"
					style={{
						scrollbarWidth: 'none',
					}}
					className="flex h-full w-full flex-col gap-5 overflow-x-hidden p-10"
				>
					{messages?.map((msg, index) => (
						<MessageBlock message={msg} key={index} />
					))}

					{isLLMThinking && <TypingLoader />}
					{/*<NewMessagesAlert showScrollButton={showScrollButton} onClick={scrollBottom} />*/}
				</ScrollShadow>
			</div>
		</motion.div>
	);
};
