import type { AuthTokens } from './types';

import axios from 'axios';

import { getRefreshToken, getToken, removeTokens, saveRefreshToken, saveToken } from './helpers';

export const $api = axios.create({
	baseURL: 'http://localhost:8000',
	headers: {
		'Content-Type': 'application/json',
	},
});

const refreshToken = async () => {
	try {
		const response = await axios.post<AuthTokens>('http://localhost:8000/auth/refresh', {
			refreshToken: getRefreshToken(),
		});
		const { token, refreshToken } = response.data;

		saveToken(token);
		saveRefreshToken(refreshToken);

		return token;
	} catch (error) {
		console.error('Failed to refresh token:', error);
		removeTokens();
		throw error;
	}
};

$api.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

$api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const newToken = await refreshToken();

				originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
				return $api(originalRequest);
			} catch (err) {
				removeTokens();
				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	},
);
