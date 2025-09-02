import './styles.css';

import { cn } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';

export const TypingLoader = () => {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{
					opacity: 0,
					scale: 0.8,
					x: -50,
				}}
				animate={{ opacity: 1, scale: 1, x: 0 }}
				transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 200 }}
				className={cn('flex w-fit flex-col rounded px-5 py-2', 'dark:bg-msg-surface self-start bg-gray-300 dark:text-white')}
			>
				<div className="loader mx-5"></div>
			</motion.div>
		</AnimatePresence>
	);
};
