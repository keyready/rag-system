import type { LoginFormSchema } from '../types/loginForm.types';

import { authUser, getIsAuthProcessing, initUserSession } from '@/entities/User';
import { RoutePath } from '@/shared/config/RouteConfig';
import { useAppDispatch } from '@/shared/utils/useAppDispatch';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { LoginSchema } from '../types/loginForm.types';

export const LoginCard = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const isAuthProcessing = useSelector(getIsAuthProcessing);

	const {
		handleSubmit,
		control,
		formState: { errors, isValid, isDirty },
	} = useForm<LoginFormSchema>({
		resolver: yupResolver(LoginSchema),
	});

	const handleFormSubmit = useCallback(
		async (data: LoginFormSchema) => {
			const result = await dispatch(authUser(data));
			if (result.meta.requestStatus === 'fulfilled') {
				await dispatch(initUserSession());
				navigate(RoutePath.welcome_chat);
			} else {
				toast.error('Проверьте правильность введенных данных');
			}
		},
		[dispatch, navigate, toast],
	);

	return (
		<Card className="w-[40%]">
			<CardHeader>
				<h1 className="text-xl">Авторизация</h1>
			</CardHeader>
			<CardBody>
				<form className="flex flex-col gap-5" onSubmit={handleSubmit(handleFormSubmit)}>
					<Controller
						render={({ field }) => (
							<Input
								isDisabled={isAuthProcessing}
								errorMessage={errors?.username?.message}
								isInvalid={!!errors?.username}
								size="sm"
								value={field.value}
								onValueChange={field.onChange}
								label="Имя пользователя"
							/>
						)}
						name="username"
						control={control}
					/>
					<Controller
						render={({ field }) => (
							<Input
								isDisabled={isAuthProcessing}
								errorMessage={errors?.password?.message}
								isInvalid={!!errors?.password}
								size="sm"
								value={field.value}
								onValueChange={field.onChange}
								label="Пароль"
								type="password"
							/>
						)}
						name="password"
						control={control}
					/>
					<Button
						isLoading={isAuthProcessing}
						className="w-1/2 self-end"
						color="success"
						isDisabled={isDirty && !isValid}
						size="sm"
						type="submit"
					>
						Войти!
					</Button>
				</form>
			</CardBody>
		</Card>
	);
};
