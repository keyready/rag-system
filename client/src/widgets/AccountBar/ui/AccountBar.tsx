import { AccountSettingsModal } from '@/widgets/AccountSettingsModal';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useCallback, useState } from 'react';

export const AccountBar = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleOpenModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	return (
		<>
			<Dropdown>
				<DropdownTrigger className="mb-4 w-7/8">
					<Button>User12345</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="Account Bar">
					<DropdownItem onPress={handleOpenModal} showDivider key="settings">
						Настройки
					</DropdownItem>
					<DropdownItem key="logout" className="text-danger" color="danger">
						Выйти из системы
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<AccountSettingsModal isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	);
};
