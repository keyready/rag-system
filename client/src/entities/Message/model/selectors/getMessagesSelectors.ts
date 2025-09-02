import type { StateSchema } from '@/app/StoreProvider/config/StateSchema';

export const getMessages = (state: StateSchema) => state.messages?.messages || [];
export const getIsLLMThinking = (state: StateSchema) => state.messages?.isLLMThinking;
