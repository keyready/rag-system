import { createContext } from 'react';

export type FontContextType = {
	font: string;
	setFont: (font: string) => void;
};

export const FontContext = createContext<FontContextType | undefined>(undefined);
