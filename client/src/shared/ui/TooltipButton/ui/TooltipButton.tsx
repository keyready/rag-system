import type { ButtonProps } from '@heroui/react';
import type { MouseEvent, ReactNode } from 'react';

import { Button, cn } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';

type TooltipButtonProps = ButtonProps & {
	tooltips?: ReactNode;
};

export const TooltipButton = (props: TooltipButtonProps) => {
	const { children, onPress, tooltips } = props;

	const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);

	const handleHoverOn = useCallback(() => setIsButtonHovered(true), []);
	const handleHoverOff = useCallback(() => setIsButtonHovered(false), []);
	const handleTooltipContainerClick = (e: MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<Button
			onMouseEnter={handleHoverOn}
			onMouseLeave={handleHoverOff}
			className={cn(
				'flex items-center justify-between bg-transparent duration-100',
				'hover:dark:bg-msg-surface hover:bg-gray-300 dark:text-white',
			)}
			onPress={onPress}
			size="sm"
			{...props}
		>
			<p className="truncate">{children}</p>
			<AnimatePresence mode="wait">
				{isButtonHovered && (
					<motion.div
						onClick={handleTooltipContainerClick}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
					>
						{tooltips}
					</motion.div>
				)}
			</AnimatePresence>
		</Button>
	);
};
