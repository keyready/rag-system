import { type ReactNode } from 'react';

export function formatText(inputText: string): ReactNode {
	const lines = inputText.split('\n');
	const elements: ReactNode[] = [];

	lines.forEach((line, index) => {
		const trimmed = line.trim();

		if (trimmed === '---') {
			elements.push(<hr key={index} className="my-4 border-gray-300" />);
			return;
		}

		if (trimmed === '') {
			elements.push(<br key={index} />);
			return;
		}

		if (trimmed.startsWith('* ')) {
			const text = trimmed.substring(2);
			elements.push(
				<li key={index} className="flex list-none items-start gap-2">
					<input type="checkbox" disabled className="mt-1" />
					<span>{renderFormattedText(text, index)}</span>
				</li>,
			);
			return;
		}

		elements.push(
			<p key={index} className="leading-relaxed">
				{renderFormattedText(line, index)}
			</p>,
		);
	});

	return <div className="space-y-2">{elements}</div>;
}

function renderFormattedText(text: string, keyPrefix = 0): ReactNode {
	const linkRegex = /\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
	const boldRegex = /\*\*(.+?)\*\*/g;

	const parts: ReactNode[] = [];
	let lastIndex = 0;
	let key = 0;

	const combinedRegex = new RegExp(`${linkRegex.source}|${boldRegex.source}`, 'g');
	let match;

	while ((match = combinedRegex.exec(text)) !== null) {
		const [fullMatch] = match;
		const matchIndex = match.index;

		if (lastIndex < matchIndex) {
			parts.push(<span key={`${keyPrefix}-${key++}`}>{text.slice(lastIndex, matchIndex)}</span>);
		}

		if (match[1] && match[2]) {
			const displayText = match[1];
			const href = match[2];
			parts.push(
				<a key={`${keyPrefix}-${key++}`} href={href} target="_blank" rel="noopener noreferrer" className="break-all text-blue-600 underline">
					{displayText}
				</a>,
			);
		} else if (match[3]) {
			parts.push(
				<strong key={`${keyPrefix}-${key++}`} className="font-semibold">
					{match[3]}
				</strong>,
			);
		}

		lastIndex = matchIndex + fullMatch.length;
	}

	if (lastIndex < text.length) {
		parts.push(<span key={`${keyPrefix}-${key++}`}>{text.slice(lastIndex)}</span>);
	}

	return parts;
}
