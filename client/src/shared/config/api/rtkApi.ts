import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { getRefreshToken, getToken, removeTokens, saveRefreshToken, saveToken } from './helpers';
import type { AuthTokens } from './types';

const rawBaseQuery = fetchBaseQuery({
	baseUrl: 'http://localhost:8000/api',
	prepareHeaders: (headers: Headers) => {
		const token = getToken();
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
	args,
	api,
	extraOptions,
) => {
	let result = await rawBaseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const refreshResponse = await rawBaseQuery(
			{
				url: '/auth/refresh',
				method: 'POST',
				body: { refreshToken: getRefreshToken() },
			},
			api,
			extraOptions,
		);

		if (refreshResponse.data) {
			const { token, refreshToken } = refreshResponse.data as AuthTokens;
			saveToken(token);
			saveRefreshToken(refreshToken);

			result = await rawBaseQuery(args, api, extraOptions);
		} else {
			removeTokens();
		}
	}

	return result;
};

export const rtkApi = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Messages', 'Chats'],
	endpoints: (_builder) => ({}),
});
