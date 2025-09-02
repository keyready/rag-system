import type { ReactNode } from 'react';

import { SELECTED_FONT_FAMILY } from '@/shared/consts';
import { useState } from 'react';

import { FontContext } from './FontContext';

export const FontProvider = ({ children }: { children: ReactNode }) => {
	const [font, setFont] = useState<string>(localStorage.getItem(SELECTED_FONT_FAMILY) || 'Comfortaa');

	return <FontContext.Provider value={{ font, setFont }}>{children}</FontContext.Provider>;
};
