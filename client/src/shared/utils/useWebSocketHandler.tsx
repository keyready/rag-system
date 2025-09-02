import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

type HandlerMap<T extends { status: string }> = {
	[K in T['status']]?: (msg: Extract<T, { status: K }>) => void;
};

interface UseWebSocketHandlerOptions<T extends { status: string }> {
	url: string;
	handlers?: HandlerMap<T>;
	onRawMessage?: (msg: T) => void;
	shouldReconnect?: boolean;
	protocols?: string | string[];
	queryParams?: Record<string, string>;
}

export function useWebSocketHandler<T extends { status: string }>({
	url,
	handlers = {},
	onRawMessage,
	shouldReconnect = true,
	protocols,
}: UseWebSocketHandlerOptions<T>) {
	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<T>(url, {
		shouldReconnect: () => shouldReconnect,
		protocols,
	});

	useEffect(() => {
		if (!lastJsonMessage) return;

		onRawMessage?.(lastJsonMessage);

		switch (lastJsonMessage.status) {
			default:
				// @ts-expect-error — для строгости, если появится новый статус без обработчика
				handlers[lastJsonMessage.status]?.(lastJsonMessage);
				break;
		}
	}, [lastJsonMessage]);

	return {
		sendJsonMessage,
		readyState,
	};
}
