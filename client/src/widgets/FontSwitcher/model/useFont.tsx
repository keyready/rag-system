import type { FontContextType } from './FontContext';

import { useContext } from 'react';

import { FontContext } from './FontContext';

export const useFont = (): FontContextType => {
	const context = useContext(FontContext);
	if (!context) {
		throw new Error('useFont must be used within a FontProvider');
	}
	return context;
};
