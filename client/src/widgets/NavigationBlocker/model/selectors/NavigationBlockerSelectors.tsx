import { type StateSchema } from '@/app/StoreProvider/config/StateSchema';

export const getIsNavigationBlockerEnabled = (state: StateSchema) =>
	state.navigationGuard.enabled || false;
export const getIsGlobalDisabling = (state: StateSchema) =>
	state.navigationGuard.globalDisabled || false;
export const getNavigationBlockerMessage = (state: StateSchema) =>
	state.navigationGuard.message || '';
