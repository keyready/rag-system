import { Button, cn } from '@heroui/react';
import { RiAddLine, RiLockLine } from '@remixicon/react';

export const UploadFilesButton = () => {
	return (
		<Button
			isDisabled
			className={cn(
				'flex items-center justify-start bg-transparent duration-100',
				'hover:dark:bg-msg-surface hover:bg-gray-300 dark:text-white',
			)}
			size="sm"
		>
			<RiAddLine size={14} />
			<RiLockLine size={14} />
			<p>Добавить файлы</p>
		</Button>
	);
};
