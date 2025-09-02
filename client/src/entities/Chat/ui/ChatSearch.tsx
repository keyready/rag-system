import type { ChangeEvent, FormEvent } from 'react';

import type { ChatSearchParams, SearchModes } from '../model/types/ChatsList';

import { $api } from '@/shared/config/api/api';
import { useHotkeys } from '@/shared/utils/useHotkeys';
import { Button, cn, Input, Modal, ModalBody, ModalContent, ModalHeader, Radio, RadioGroup } from '@heroui/react';
import { RiSearchLine } from '@remixicon/react';
import { useCallback, useState } from 'react';

export const ChatSearch = () => {
	const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
	const [searchParams, setSearchParams] = useState<ChatSearchParams>({
		mode: 'machine',
	});

	const handleOpenModalPress = useCallback(() => {
		setIsModalOpened(true);
	}, []);

	const handleModalClose = useCallback(() => {
		setIsModalOpened(false);
	}, []);

	const handleSearchChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
		setSearchParams((ps) => ({
			...ps,
			search: ev.target.value,
		}));
	}, []);

	const handleModeChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
		setSearchParams((ps) => ({
			...ps,
			mode: ev.target.value as SearchModes,
		}));
	}, []);

	const handleSearchSubmit = useCallback(
		async (ev: FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			const { data } = await $api.post('/search', searchParams);
			console.log(data);
		},
		[searchParams],
	);

	useHotkeys(['control', 'shift', 'f'], handleOpenModalPress);

	return (
		<>
			<Button
				onPress={handleOpenModalPress}
				className={cn(
					'flex items-center justify-between bg-transparent duration-100',
					'hover:dark:bg-msg-surface hover:bg-gray-300 dark:text-white',
				)}
				size="sm"
			>
				<div className="justidy-start flex items-center gap-2">
					<RiSearchLine size={14} />
					<p>Поиск по чатам</p>
				</div>
				<p className="dark:text-sidebar text-gray-200 hover:text-white/80">Ctrl+Shift+F</p>
			</Button>

			<Modal
				classNames={{
					base: 'w-3/5 min-h-1/4',
					body: 'w-full h-full',
				}}
				isOpen={isModalOpened}
				onClose={handleModalClose}
			>
				<ModalContent>
					<ModalHeader>Поиск по чатам</ModalHeader>
					<ModalBody>
						<form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
							<Input value={searchParams?.search} onChange={handleSearchChange} size="sm" label="Введите строку для поиска" />
							<RadioGroup defaultValue="machine" value={searchParams?.mode} onChange={handleModeChange}>
								<Radio value="machine">Искать по совпадению</Radio>
								<Radio value="ai">Искать с помощью AI</Radio>
							</RadioGroup>
							<Button type="submit" className="bg-main w-2/5 self-end">
								Искать
							</Button>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
