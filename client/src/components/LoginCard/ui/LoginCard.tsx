import type { LoginFormSchema } from '../types/loginForm.types';

import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { LoginSchema } from '../types/loginForm.types';

export const LoginCard = () => {
	const {
		handleSubmit,
		control,
		formState: { errors, isValid, isDirty },
	} = useForm<LoginFormSchema>({
		resolver: yupResolver(LoginSchema),
	});

	const handleFormSubmit = useCallback((data: LoginFormSchema) => {
		alert(JSON.stringify(data));
	}, []);

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
								errorMessage={errors?.login?.message}
								isInvalid={!!errors?.login}
								size="sm"
								value={field.value}
								onValueChange={field.onChange}
								label="Имя пользователя"
							/>
						)}
						name="login"
						control={control}
					/>
					<Controller
						render={({ field }) => (
							<Input
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
					<Button className="w-1/2 self-end" color="success" isDisabled={isDirty && !isValid} size="sm" type="submit">
						Войти!
					</Button>
				</form>
			</CardBody>
		</Card>
	);
};
