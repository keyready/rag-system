import type { SendMessageHotkeyTypes } from '@/widgets/SendMessageHotkey';

import { SEND_MESSAGE_HOTKEY } from '@/shared/consts';
import {
	Button,
	cn,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Slider,
	Textarea,
} from '@heroui/react';
import {
	RiErrorWarningLine,
	RiSendPlaneLine,
	RiSettings4Line,
} from '@remixicon/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface ChatTextareaProps {
	className?: string;
	sendMessage: (message: string, contextLength?: number) => void;
}

export const ChatTextarea = ({ className, sendMessage }: ChatTextareaProps) => {
	const [message, setMessage] = useState<string>('');
	const [contextLength, setContextLength] = useState<number>(3);

	const handleSendMessage = useCallback(() => {
		if (!message.trim()) return;

		sendMessage(message, contextLength);
		setMessage('');
	}, [message, contextLength, sendMessage]);

	useEffect(() => {
		const handleEnterClick = (event: KeyboardEvent) => {
			if (!message) return;

			const selectedSendMode = (localStorage.getItem(
				SEND_MESSAGE_HOTKEY,
			) || 'Enter') as SendMessageHotkeyTypes;
			if (selectedSendMode === 'Enter') {
				if (event.code === 'Enter') {
					handleSendMessage();
				}
			} else {
				if (event.code === 'Enter' && event.ctrlKey) {
					handleSendMessage();
				}
			}
		};

		document.addEventListener('keydown', handleEnterClick);
		return () => {
			document.removeEventListener('keydown', handleEnterClick);
		};
	}, [handleSendMessage]);

	return (
		<div className={cn(className, 'p-4')}>
			<Textarea
				autoFocus
				value={message}
				onChange={(ev) => setMessage(ev.target.value)}
				label="Что искать сегодня?"
				endContent={
					<div className="w-10 translate-x-3 -translate-y-1.5">
						<Button
							isDisabled={!message}
							onPress={handleSendMessage}
							className="h-fit min-h-0 min-w-0 rounded-none bg-transparent p-0"
						>
							<RiSendPlaneLine />
						</Button>
						<Popover placement="top-end">
							<PopoverTrigger>
								<Button className="h-fit min-h-0 min-w-0 rounded-none bg-transparent p-0">
									<RiSettings4Line />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[400px]">
								<AnimatePresence mode="wait">
									{contextLength < 3 && (
										<motion.div
											key="low-context-warning"
											initial={{
												opacity: 0,
												scale: 0.95,
											}}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.95 }}
											transition={{ duration: 0.2 }}
										>
											<div className="mb-4 flex items-center gap-3">
												<RiErrorWarningLine
													size={24}
													className="text-danger flex-[1_0_auto]"
												/>
												<p className="text-danger">
													При малом количестве
													контекста ответы будут
													быстрее, но, скорее всего,
													менее точныии
												</p>
											</div>
										</motion.div>
									)}
									{contextLength > 10 && (
										<motion.div
											key="high-context-warning"
											initial={{
												opacity: 0,
												scale: 0.95,
											}}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.95 }}
											transition={{ duration: 0.2 }}
										>
											<div className="mb-4 flex items-center gap-3">
												<RiErrorWarningLine
													size={24}
													className="text-danger flex-[1_0_auto]"
												/>
												<p className="text-danger">
													При большом количестве
													контекста ответы будут
													долгими, но более точными
												</p>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
								<Slider
									showSteps
									size="sm"
									minValue={2}
									maxValue={20}
									getValue={(val) => `${val} чанка (-ов)`}
									defaultValue={3}
									value={contextLength}
									onChange={(val) =>
										setContextLength(
											val as unknown as number,
										)
									}
									label="Количество контекста"
								/>
							</PopoverContent>
						</Popover>
					</div>
				}
			/>
		</div>
	);
};
