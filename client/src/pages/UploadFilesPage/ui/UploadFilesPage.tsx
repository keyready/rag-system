import { UploadFile } from '@/comp/UploadFile';
import { Page } from '@/widgets/Page';

export const UploadFilesPage = () => {
	return (
		<Page>
			<h1 className="w-4/5 text-center text-xl">На этой странице Вы можете добавить свои файлы в систему для дальнейшей работы с ними</h1>
			<UploadFile />
		</Page>
	);
};
