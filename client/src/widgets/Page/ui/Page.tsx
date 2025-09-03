import { cn } from '@heroui/react';
import { type ReactNode } from 'react';

export const Page = ({ children }: { children: ReactNode }) => {
	return (
		<section className={cn('relative flex h-screen w-full flex-col items-center justify-start gap-10', 'dark:bg-main dark:text-white')}>
			{children}
		</section>
	);
};
