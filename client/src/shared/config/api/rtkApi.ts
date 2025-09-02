import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getToken } from './helpers';

export const rtkApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:8000/api',
		prepareHeaders: (headers: Headers) => {
			const token = getToken();
			if (token) {
				headers.set('Authorization', token);
			}
			return headers;
		},
	}),
	endpoints: (_builder) => ({}),
});
