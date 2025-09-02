import { AnimatePresence, motion } from 'framer-motion';

interface NewMessagesAlertProps {
	showScrollButton: boolean;
	onClick: () => void;
}

export const NewMessagesAlert = ({ showScrollButton, onClick }: NewMessagesAlertProps) => {
	return (
		<AnimatePresence>
			{showScrollButton && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
					<button
						onClick={onClick}
						className="absolute right-1/2 bottom-6 z-10 flex w-3/5 translate-x-1/2 cursor-pointer flex-col items-center justify-center bg-gray-400/50 py-4 backdrop-blur"
					>
						<p>Новые сообщения!</p>
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
