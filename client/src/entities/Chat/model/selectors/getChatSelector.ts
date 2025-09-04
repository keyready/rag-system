import { type StateSchema } from '@/app/StoreProvider/config/StateSchema';

export const getIsChatTitleChanging = (state: StateSchema) =>
	state.chat.isTitleChanging || false;
export const getIsChatDeleting = (state: StateSchema) =>
	state.chat.isChatDeleting || false;
