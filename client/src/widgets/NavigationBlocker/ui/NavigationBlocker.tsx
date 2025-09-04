import type { FormEvent } from 'react';

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useBlocker } from 'react-router';

import {
	getIsNavigationBlockerEnabled,
	getNavigationBlockerMessage,
} from '../model/selectors/NavigationBlockerSelectors';

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

	const handleNavigationSubmit = useCallback(
		(ev: FormEvent<HTMLFormElement>) => {
			ev.preventDefault();

			blocker.proceed?.();
		},
		[],
	);

	return (
		<Modal
			isOpen={blocker.state === 'blocked'}
			onOpenChange={() => {}}
			hideCloseButton
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					Подтвердите переход
				</ModalHeader>
				<ModalBody>
					<p>
						{message || 'Вы уверены, что хотите покинуть страницу?'}
					</p>
				</ModalBody>
				<ModalFooter>
					<form
						className="flex gap-2"
						onSubmit={handleNavigationSubmit}
					>
						<Button
							color="success"
							variant="light"
							onPress={() => blocker.reset?.()}
						>
							Остаться
						</Button>
						<Button autoFocus color="danger" type="submit">
							Перейти
						</Button>
					</form>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
