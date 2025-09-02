export const formatTime = (date: Date | undefined) => {
	if (!date) return '';
	return date.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
};

export const formatDateTime = (date: Date | undefined) => {
	if (!date) return '';
	return date.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
};
