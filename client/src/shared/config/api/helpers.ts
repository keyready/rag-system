import { USER_REF_TOKEN_KEY, USER_TOKEN_KEY } from '@/shared/consts';

export const getToken = () => {
	return localStorage.getItem(USER_TOKEN_KEY) || '';
};

export const saveToken = (token: string) => {
	localStorage.setItem(USER_TOKEN_KEY, token);
};

export const getRefreshToken = () => {
	return localStorage.getItem(USER_REF_TOKEN_KEY) || '';
};

export const saveRefreshToken = (refreshToken: string) => {
	localStorage.setItem(USER_REF_TOKEN_KEY, refreshToken);
};

export const removeTokens = () => {
	localStorage.removeItem(USER_TOKEN_KEY);
	localStorage.removeItem(USER_REF_TOKEN_KEY);
};
