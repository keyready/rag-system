import type { Message } from '../model/types/Message';

import { formatText } from '@/shared/utils/formatText';
import { formatTime } from '@/shared/utils/formatTime';
import { Accordion, AccordionItem, cn } from '@heroui/react';
import { motion } from 'framer-motion';

interface MessageBlockProps {
	message: Message;
}

export const MessageBlock = (props: MessageBlockProps) => {
	const { message } = props;

	return (
		<motion.div
			initial={{
				opacity: 0,
				scale: 0.8,
				...(message.author === 'user' ? { x: 200 } : { x: -200 }),
			}}
			animate={{ opacity: 1, scale: 1, x: 0 }}
			transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 200 }}
			className={cn(
				'rounded-large flex max-w-2/3 min-w-1/3 flex-col px-5 py-2',
				message.author === 'user'
					? 'dark:bg-msg-surface self-end bg-gray-200 dark:text-white'
					: 'max-w-full self-start text-justify text-black dark:text-white',
			)}
		>
			<p className="text-xs opacity-70">
				{message.author === 'assistant' ? 'Чат-бот, ' : 'Вы, '}
				{formatTime(new Date(message.createdAt))}
			</p>

			{formatText(message.body)}

			{message?.context?.length ? (
				<Accordion>
					<AccordionItem title="Контекст">
						{message.context.map((ctx, index) => (
							<div key={index} className="flex items-start">
								<input type="checkbox" />
								<p>{ctx}</p>
							</div>
						))}
					</AccordionItem>
				</Accordion>
			) : null}

			{message?.modifiedAt && <p className="self-end text-xs italic opacity-70">Изм. {formatTime(new Date(message.modifiedAt))}</p>}
		</motion.div>
	);
};
