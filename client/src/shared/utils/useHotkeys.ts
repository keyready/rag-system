import { useEffect } from 'react';

const KEY_CODE_MAP: Record<string, string> = {
	'ctrl': 'ControlLeft',
	'control': 'ControlLeft',
	'shift': 'ShiftLeft',
	'alt': 'Alt',
	'meta': 'Meta',
	'cmd': 'Meta',
	'a': 'KeyA',
	'b': 'KeyB',
	'c': 'KeyC',
	'd': 'KeyD',
	'e': 'KeyE',
	'f': 'KeyF',
	'g': 'KeyG',
	'h': 'KeyH',
	'i': 'KeyI',
	'j': 'KeyJ',
	'k': 'KeyK',
	'l': 'KeyL',
	'm': 'KeyM',
	'n': 'KeyN',
	'o': 'KeyO',
	'p': 'KeyP',
	'q': 'KeyQ',
	'r': 'KeyR',
	's': 'KeyS',
	't': 'KeyT',
	'u': 'KeyU',
	'v': 'KeyV',
	'w': 'KeyW',
	'x': 'KeyX',
	'y': 'KeyY',
	'z': 'KeyZ',
	'0': 'Digit0',
	'1': 'Digit1',
	'2': 'Digit2',
	'3': 'Digit3',
	'4': 'Digit4',
	'5': 'Digit5',
	'6': 'Digit6',
	'7': 'Digit7',
	'8': 'Digit8',
	'9': 'Digit9',
	'f1': 'F1',
	'f2': 'F2',
	'f3': 'F3',
	'f4': 'F4',
	'f5': 'F5',
	'f6': 'F6',
	'f7': 'F7',
	'f8': 'F8',
	'f9': 'F9',
	'f10': 'F10',
	'f11': 'F11',
	'f12': 'F12',
	'enter': 'Enter',
	'escape': 'Escape',
	'esc': 'Escape',
	'backspace': 'Backspace',
	'tab': 'Tab',
	'space': 'Space',
	' ': 'Space',
	'arrowup': 'ArrowUp',
	'arrowdown': 'ArrowDown',
	'arrowleft': 'ArrowLeft',
	'arrowright': 'ArrowRight',
	'[': 'BracketLeft',
	']': 'BracketRight',
	'\\': 'Backslash',
	';': 'Semicolon',
	"'": 'Quote',
	',': 'Comma',
	'.': 'Period',
	'/': 'Slash',
	'`': 'Backquote',
	'-': 'Minus',
	'=': 'Equal',
};

export function useHotkeys(combo: string[], callback: () => void) {
	useEffect(() => {
		const keysPressed = new Set<string>();

		const normalizedCombo = combo.map((k) => {
			const lowerKey = k.toLowerCase();
			return KEY_CODE_MAP[lowerKey] || k;
		});

		const downHandler = (e: KeyboardEvent) => {
			const code = e.code;
			keysPressed.add(code);

			if (normalizedCombo.includes(code)) {
				e.preventDefault();
			}

			const isMatch =
				normalizedCombo.every((k) => keysPressed.has(k)) &&
				keysPressed.size === normalizedCombo.length;

			if (isMatch) {
				e.preventDefault();
				callback();
			}
		};

		const upHandler = (e: KeyboardEvent) => {
			keysPressed.delete(e.code);
		};

		document.addEventListener('keydown', downHandler);
		document.addEventListener('keyup', upHandler);

		return () => {
			document.removeEventListener('keydown', downHandler);
			document.removeEventListener('keyup', upHandler);
		};
	}, [combo, callback]);
}
