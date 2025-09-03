import { getUserData, logoutUser } from '@/entities/User';
import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { AccountSettingsModal } from '@/widgets/AccountSettingsModal';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

export const AccountBar = () => {
	const dispatch = useAppDispatch();

	const username = useSelector(getUserData)?.username || '';

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
					<Button>{username}</Button>
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

			<AccountSettingsModal isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	);
};
