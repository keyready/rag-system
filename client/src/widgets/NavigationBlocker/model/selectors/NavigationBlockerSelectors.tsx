import type { StateSchema } from '@/app/store/StateSchema';

export const getIsNavigationBlockerEnabled = (state: StateSchema) => state.navigationGuard.enabled || false;
export const getNavigationBlockerMessage = (state: StateSchema) => state.navigationGuard.message || '';
