export interface User {
	id: string;
	username: string;
	name: string;
}

export interface UserAuthCredentials {
	password: string;
	username: string;
}

export interface UserTokens {
	accessToken: string;
	refreshToken: string;
}

export interface PasswordData {
	isPasswordLoading: boolean;
	passwordChangeError?: string;

	newPassword?: string;
	oldPassword?: string;
	repeatPassword?: string;
}

export interface UserSchema {
	data?: User;
	passwordChanging: PasswordData;
	isAuthProcessing: boolean;
	isLoading: boolean;
	isSessionChecking: boolean;
	error?: string;
}
