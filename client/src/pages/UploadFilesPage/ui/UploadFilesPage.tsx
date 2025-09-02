import { UploadFile } from '@/comp/UploadFile';

export const UploadFilesPage = () => {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-10 py-10">
			<h1 className="w-4/5 text-center text-xl">На этой странице Вы можете добавить свои файлы в систему для дальнейшей работы с ними</h1>
			<UploadFile />
		</div>
	);
};
