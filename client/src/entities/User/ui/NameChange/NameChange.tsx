import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { Button, Input } from '@heroui/react';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { getUserData } from '../../model/selectors/UserSelectors';
import { changeUserName } from '../../model/service/changeUserName';

export const NameChange = () => {
	const userName = useSelector(getUserData)?.name;
	const dispatch = useAppDispatch();

	const [modifiedUserName, setModifiedUserName] = useState<string>(userName || '');

	const handleChangeUserName = useCallback((val: string) => {
		setModifiedUserName(val);
	}, []);

	const shouldSaveButtonBeRendered = useMemo(() => {
		return userName !== modifiedUserName && modifiedUserName;
	}, [userName, modifiedUserName]);

	const handleChangeName = useCallback(() => {
		dispatch(changeUserName(modifiedUserName));
	}, [modifiedUserName]);

	return (
		<div className="grid grid-cols-6 items-start gap-5">
			<h2 className="my-1">Имя:</h2>
			<div className="col-span-5 flex w-full flex-col">
				<Input
					onValueChange={handleChangeUserName}
					value={modifiedUserName}
					size="sm"
					endContent={
						shouldSaveButtonBeRendered ? (
							<Button onPress={handleChangeName} size="sm">
								Сохранить
							</Button>
						) : null
					}
				/>
				<p className="text-xs italic opacity-50">
					По желанию введите ваше имя или как к вам можно обращаться. ИИ будет использовать это для "очеловечивания" диалога
				</p>
			</div>
		</div>
	);
};
