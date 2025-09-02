import { useEffect } from 'react';

export function useHotkeys(combo: string[], callback: () => void) {
	useEffect(() => {
		const keysPressed = new Set<string>();
		const normalizedCombo = combo.map((k) => k.toLowerCase());

		const downHandler = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			keysPressed.add(key);
			if (normalizedCombo.includes(key)) {
				e.preventDefault();
			}

			const isMatch = normalizedCombo.every((k) => keysPressed.has(k));
			if (isMatch) {
				e.preventDefault();
				callback();
			}
		};

		const upHandler = (e: KeyboardEvent) => {
			keysPressed.delete(e.key.toLowerCase());
		};

		document.addEventListener('keydown', downHandler);
		document.addEventListener('keyup', upHandler);
		return () => {
			document.removeEventListener('keydown', downHandler);
			document.removeEventListener('keyup', upHandler);
		};
	}, [combo, callback]);
}
