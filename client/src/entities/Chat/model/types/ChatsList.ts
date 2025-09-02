export interface Chat {
	chat_id: string;
	title: string;
}

export type SearchModes = 'ai' | 'machine';
export interface ChatSearchParams {
	search?: string;
	mode: SearchModes;
}
