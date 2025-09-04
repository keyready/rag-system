import type { StateSchema } from '@/app/StoreProvider/config/StateSchema';

export const getUserData = (state: StateSchema) => state.user.data;
export const getUserPasswordChangingError = (state: StateSchema) => state.user.passwordChanging?.passwordChangeError || '';
export const getIsUserPasswordChanging = (state: StateSchema) => state.user.passwordChanging?.isPasswordLoading || false;
export const getIsSessionChecking = (state: StateSchema) => state.user.isSessionChecking || false;
export const getIsAuthProcessing = (state: StateSchema) => state.user.isAuthProcessing || false;

export const getOldUserPassword = (state: StateSchema) => state.user.passwordChanging?.oldPassword || '';
export const getNewUserPassword = (state: StateSchema) => state.user.passwordChanging?.newPassword || '';
export const getRepeatedUserPassword = (state: StateSchema) => state.user.passwordChanging?.repeatPassword || '';
