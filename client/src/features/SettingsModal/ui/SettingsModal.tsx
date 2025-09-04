import { NameChange, PasswordChange } from '@/entities/User';
import { FontSwitcher } from '@/widgets/FontSwitcher';
import { SendMessageHotkey } from '@/widgets/SendMessageHotkey';
import { ThemeSwitcher } from '@/widgets/ThemeSwitcher';
import { Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs } from '@heroui/react';

export const SettingsModal = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (state: boolean) => void }) => {
	return (
		<Modal
			size="2xl"
			classNames={{
				base: 'w-2/3 h-2/3',
				body: 'w-full h-full p-0',
			}}
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
		>
			<ModalContent className="overflow-x-hidden">
				<ModalHeader className="mb-5 border-b-2 border-b-gray-400">
					<h1>Настройки</h1>
				</ModalHeader>
				<ModalBody>
					<Tabs
						classNames={{
							tabList: 'bg-transparent',
						}}
						isVertical
					>
						<Tab className="w-full" title="Общие настройки">
							<div className="flex flex-col gap-4">
								<ThemeSwitcher />
								<SendMessageHotkey />
								<FontSwitcher />
							</div>
						</Tab>
						<Tab className="w-full" title="Аккаунт">
							<div className="flex flex-col gap-4">
								<NameChange />
								<PasswordChange />
							</div>
						</Tab>
						<Tab className="w-full" title="О программе">
							<p className="indent-4">
								Добро пожаловать на мой сайт, где ты можешь общаться со мной, задавать вопросы, получать информацию и просто
								поболтать. Я - большая языковая модель, и я здесь, чтобы помочь тебе с любой задачей, требующей интеллекта и общения.
							</p>
							<p className="indent-4">
								Не стесняйся, спрашивай, предлагай темы для обсуждения, и вместе мы можем узнать что-то новое или просто приятно
								провести время!
							</p>
						</Tab>
					</Tabs>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
