import type { ChangeEvent, DragEvent } from 'react';

import { Button, cn } from '@heroui/react';
import { useCallback, useState } from 'react';

/** @deprecated use import from features section instead */
export const UploadFile = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [isHovered, setIsHovered] = useState<boolean>(false);

	const isUniqueFile = (newFile: File, existingFiles: File[]) => {
		return !existingFiles.some((file) => file.name === newFile.name && file.size === newFile.size);
	};

	const handleFilesChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
		ev.preventDefault();

		if (ev.target.files && ev.target.files.length > 0) {
			const newFiles = Array.from(ev.target.files);

			setFiles((prev) => {
				const uniqueNewFiles = newFiles.filter((file) => isUniqueFile(file, prev));
				return [...prev, ...uniqueNewFiles];
			});
		}

		ev.target.value = '';
	}, []);

	const handleDrop = useCallback((ev: DragEvent<HTMLDivElement>) => {
		ev.preventDefault();
		ev.stopPropagation();

		if (ev.dataTransfer.files && ev.dataTransfer.files.length > 0) {
			const droppedFiles = Array.from(ev.dataTransfer.files);

			setFiles((prev) => {
				const uniqueNewFiles = droppedFiles.filter((file) => isUniqueFile(file, prev));
				return [...prev, ...uniqueNewFiles];
			});
		}
	}, []);

	const handleDragOver = useCallback((ev: DragEvent<HTMLDivElement>) => {
		ev.preventDefault();
		ev.stopPropagation();
		setIsHovered(true);
	}, []);

	const handleDragLeave = useCallback(() => {
		setIsHovered(false);
	}, []);

	const removeFile = useCallback((index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	}, []);

	return (
		<div
			className={cn(
				'flex min-h-40 w-[500px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-400 p-4 duration-200 hover:bg-gray-50',
				isHovered ? 'bg-blue-300' : 'bg-transparent',
			)}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
		>
			<input type="file" multiple onChange={handleFilesChange} className="hidden" id="file-upload" />

			<Button size="sm" className="w-1/2" color="success">
				<label className="flex h-full w-full cursor-pointer items-center justify-center" htmlFor="file-upload">
					Добавить файлы
				</label>
			</Button>

			<p className="mb-4 text-sm text-gray-500">Перетащите сюда файлы или нажмите выше</p>

			{files.length > 0 && (
				<ul className="mt-2 max-h-40 w-full overflow-y-auto text-sm">
					{files.map((file, index) => (
						<li key={index} className="flex justify-between py-1">
							<span title={file.name}>{file.name}</span>
							<button
								type="button"
								onClick={() => removeFile(index)}
								className="cursor-pointer text-red-500 duration-200 hover:text-red-700"
							>
								Удалить
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
