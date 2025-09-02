import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
	login: yup.string().required('Логин обязателен').min(3, 'Логин должен быть не менее 3 символов'),
	password: yup.string().required('Пароль обязателен').min(6, 'Пароль должен быть не менее 6 символов'),
});

export type LoginFormSchema = yup.InferType<typeof LoginSchema>;
