import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useBlocker } from 'react-router';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';

import type { StateSchema } from '@/app/store/StateSchema';

export const NavigationBlocker = () => {
	const enabled = useSelector((state: StateSchema) => state.navigationGuard.enabled);
	const message = useSelector((state: StateSchema) => state.navigationGuard.message);

	const blocker = useBlocker(({ currentLocation, nextLocation }) => {
		if (!enabled) return false;
		if (currentLocation.pathname === nextLocation.pathname) return false;
		return true;
	});

	useEffect(() => {
		if (!enabled) return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = message || '';
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
								<p>{message || 'Вы уверены, что хотите покинуть страницу?'}{blocker.location ? ` (${blocker.location.pathname})` : ''}</p>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={() => blocker.reset?.()}>Остаться</Button>
								<Button color="primary" onPress={() => blocker.proceed?.()}>Перейти</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}; 