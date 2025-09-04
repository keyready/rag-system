import { SettingsModal } from '@/features/SettingsModal';
import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { getIsSessionChecking, getUserData } from '../../model/selectors/UserSelectors';
import { logoutUser } from '../../model/service/logoutUser';

export const AccountBar = () => {
	const dispatch = useAppDispatch();

	const username = useSelector(getUserData)?.username || '';
	const isSessionChecking = useSelector(getIsSessionChecking);

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleOpenModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const handleLogout = useCallback(async () => {
		await dispatch(logoutUser());
	}, [dispatch]);

	return (
		<>
			<Dropdown>
				<DropdownTrigger className="mb-4 w-7/8">
					<Button isLoading={isSessionChecking}>{!isSessionChecking && username}</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="Account Bar">
					<DropdownItem onPress={handleOpenModal} showDivider key="settings">
						Настройки
					</DropdownItem>
					<DropdownItem onPress={handleLogout} key="logout" className="text-danger" color="danger">
						Выйти из системы
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<SettingsModal isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	);
};
