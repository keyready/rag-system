import type { StateSchema } from '@/app/StoreProvider/config/StateSchema';
import type { FormEvent } from 'react';

import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { Button, Input } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { getIsUserPasswordChanging, getNewUserPassword, getOldUserPassword, getRepeatedUserPassword } from '../../model/selectors/UserSelectors';
import { changeUserPassword } from '../../model/service/changeUserPassword';
import { userActions } from '../../model/slice/UserSlice';

export const PasswordChange = () => {
	const { isPasswordChanging, oldPassword, newPassword, repeatPassword } = useSelector(
		(state: StateSchema) => ({
			isPasswordChanging: getIsUserPasswordChanging(state),
			oldPassword: getOldUserPassword(state),
			newPassword: getNewUserPassword(state),
			repeatPassword: getRepeatedUserPassword(state),
		}),
		shallowEqual,
	);

	const dispatch = useAppDispatch();

	const [isPasswordChangingMode, setIsPasswordChangingMode] = useState<boolean>(false);

	const setPasswordByType = useMemo(
		() => ({
			old: userActions.setOldPassword,
			new: userActions.setNewPassword,
			rep: userActions.setRepeatedPassword,
		}),
		[],
	);

	const handleChangePassword = useCallback(
		(val: string, type: 'old' | 'new' | 'rep') => {
			dispatch(setPasswordByType[type](val));
		},
		[dispatch, setPasswordByType],
	);

	const cancelPasswordChanging = useCallback(() => {
		dispatch(userActions.resetPasswords());
		setIsPasswordChangingMode(false);
	}, [dispatch]);

	const handlePasswordChangeSubmit = useCallback(
		async (ev: FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			const result = await dispatch(changeUserPassword());
			if (result.meta.requestStatus === 'fulfilled') {
				setIsPasswordChangingMode(false);
			} else {
				dispatch(userActions.setNewPassword(''));
				dispatch(userActions.setRepeatedPassword(''));
			}
		},
		[dispatch],
	);

	return (
		<div className="grid grid-cols-6 items-start gap-5">
			<h2 className="mt-0.5">Пароль:</h2>
			<AnimatePresence mode="popLayout">
				{isPasswordChangingMode ? (
					<motion.form
						onSubmit={handlePasswordChangeSubmit}
						key="pass-change"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 1.1 }}
						transition={{ duration: 0.2 }}
						className="col-span-5 flex w-full flex-col gap-2"
					>
						<div className="grid w-full grid-cols-3 gap-3">
							<label htmlFor="current-password" className="text-sm opacity-80">
								Текущий пароль:
							</label>
							<Input
								id="current-password"
								name="currentPassword"
								type="password"
								autoComplete="current-password"
								autoCapitalize="off"
								autoCorrect="off"
								spellCheck="false"
								autoFocus
								value={oldPassword}
								onValueChange={(val) => handleChangePassword(val, 'old')}
								isRequired
								className="col-span-2"
								size="sm"
							/>
						</div>
						<div className="grid w-full grid-cols-3 gap-3">
							<label htmlFor="new-password" className="text-sm opacity-80">
								Новый пароль:
							</label>
							<Input
								id="new-password"
								name="newPassword"
								type="password"
								autoComplete="new-password"
								autoCapitalize="off"
								autoCorrect="off"
								spellCheck="false"
								value={newPassword}
								onValueChange={(val) => handleChangePassword(val, 'new')}
								isRequired
								className="col-span-2"
								size="sm"
							/>
						</div>
						<div className="grid w-full grid-cols-3 gap-3">
							<label htmlFor="confirm-password" className="text-sm opacity-80">
								Повторите пароль:
							</label>
							<Input
								id="confirm-password"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								autoCapitalize="off"
								autoCorrect="off"
								spellCheck="false"
								value={repeatPassword}
								onValueChange={(val) => handleChangePassword(val, 'rep')}
								isRequired
								className="col-span-2"
								size="sm"
							/>
						</div>
						<div className="col-span-6 flex justify-end gap-3">
							<Button onPress={cancelPasswordChanging} size="sm" color="danger">
								Отменить
							</Button>
							<Button type="submit" size="sm" color="success">
								Сохранить
							</Button>
						</div>
					</motion.form>
				) : (
					<motion.div
						key="pass-change-activator"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 1.1 }}
						transition={{ duration: 0.2 }}
					>
						<Button isLoading={isPasswordChanging} onPress={() => setIsPasswordChangingMode(true)} className="col-span-6" size="sm">
							{isPasswordChanging ? 'Ожидайте' : 'Сменить пароль'}
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
