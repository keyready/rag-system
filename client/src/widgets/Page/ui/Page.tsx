import { cn } from '@heroui/react';
import { type CSSProperties, type ReactNode } from 'react';

export const Page = ({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) => {
	return (
		<section
			className={cn(className, 'relative flex h-screen w-full flex-col items-center gap-10', 'dark:bg-main dark:text-white')}
			style={style}
		>
			{children}
		</section>
	);
};
