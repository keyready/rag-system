import { getIsSessionChecking } from '@/entities/User';
import { cn, Image } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export const AuthorizationLoader = () => {
	const isSessionChecking = useSelector(getIsSessionChecking);

	return (
		<AnimatePresence mode="wait">
			{isSessionChecking ? (
				<motion.div
					key="AuthorizationLoader"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="pointer-events-auto absolute inset-0 top-0 right-0 bottom-0 left-0 z-[2147483647] flex w-full flex-col items-center justify-center bg-black/20 backdrop-blur-xs dark:bg-transparent"
				>
					<div className={cn('flex flex-col items-center justify-center rounded-3xl p-5', 'dark:bg-black-60 bg-black/30')}>
						<Image src="/auth-waiting.webp" height="256px" />
						<h1 className="text-center text-2xl text-white">Проверяем сессию...</h1>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};
