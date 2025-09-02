import type { ReactNode } from 'react';

export interface MenuItem {
	title: string;
	onClick?: () => void;
	type?: 'action' | 'info';
	icon?: ReactNode;
	severity?: string;
}

export interface ContextMenuSchema {
	isOpen: boolean;
	x: number;
	y: number;
	items: MenuItem[];
}
