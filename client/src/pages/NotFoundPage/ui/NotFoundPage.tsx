import { Page } from '@/widgets/Page';
import { Image } from '@heroui/react';

export const NotFoundPage = () => {
	return (
		<Page>
			<div className="flex flex-col items-center">
				<Image height="512px" src="/404-not-found.webp" />
				<h1 className="px-10 text-center text-3xl">Ресурс, который вы запрашиваете, перемещен или не сущестувует. Вернитесь на главную</h1>
			</div>
		</Page>
	);
};
