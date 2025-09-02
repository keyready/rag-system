import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useBlocker } from 'react-router';

import { getIsNavigationBlockerEnabled, getNavigationBlockerMessage } from '../model/selectors/NavigationBlockerSelectors';

export const NavigationBlocker = () => {
	const enabled = useSelector(getIsNavigationBlockerEnabled);
	const message = useSelector(getNavigationBlockerMessage);

	const blocker = useBlocker(({ currentLocation, nextLocation }) => {
		if (!enabled) return false;
		return currentLocation.pathname !== nextLocation.pathname;
	});

	useEffect(() => {
		if (!enabled) return;

		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			return message || '';
		};

		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	}, [enabled, message]);

	return (
		<>
			<Modal isOpen={blocker.state === 'blocked'} onOpenChange={() => {}} hideCloseButton>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className="flex flex-col gap-1">Подтвердите переход</ModalHeader>
							<ModalBody>
								<p>{message || 'Вы уверены, что хотите покинуть страницу?'}</p>
							</ModalBody>
							<ModalFooter>
								<Button className="w-1/3" color="success" variant="light" onPress={() => blocker.reset?.()}>
									Остаться
								</Button>
								<Button className="w-1/3" color="danger" onPress={() => blocker.proceed?.()}>
									Перейти
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
