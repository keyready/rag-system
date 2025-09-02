import type { SharedSelection } from '@heroui/react';

import { SELECTED_FONT_FAMILY } from '@/shared/consts';
import { useFont } from '@/widgets/FontSwitcher';
import { Select, SelectItem } from '@heroui/react';
import { useCallback } from 'react';

export const fonts = [
	{ key: 'Tektur', label: 'Tektur' },
	{ key: 'Comfortaa', label: 'Comfortaa' },
	{ key: 'Marck_Script', label: 'Marck Script' },
	{ key: 'Rubik_Burned', label: 'Rubik Burned' },
];

export const FontSwitcher = () => {
	const { font, setFont } = useFont();

	const handleChangeFont = useCallback((font: SharedSelection) => {
		setFont(font.currentKey as string);
		localStorage.setItem(SELECTED_FONT_FAMILY, font.currentKey as string);
	}, []);

	return (
		<div className="flex w-full items-center justify-between">
			<h2>Шрифт</h2>

			<Select className="w-1/3" defaultSelectedKeys={[font]} selectedKeys={[font]} onSelectionChange={handleChangeFont} size="sm">
				{fonts.map((font) => (
					<SelectItem key={font.key}>{font.label}</SelectItem>
				))}
			</Select>
		</div>
	);
};
