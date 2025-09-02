import type { StateSchema } from '@/app/StoreProvider/config/StateSchema';

export const getMessages = (state: StateSchema) => state.messages?.data.messages || [];
export const getIsLLMThinking = (state: StateSchema) => state.messages?.data.isLLMThinking;
