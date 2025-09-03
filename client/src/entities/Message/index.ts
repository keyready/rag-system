export type { MessageAuthorType, Message, ResponseMessage, WSMessageStatus } from './model/types/Message';
export type { MessagesSchema } from './model/types/MessagesSchema';
export { MessageBlock } from './ui/MessageBlock';

// Legacy exports for backward compatibility (will be removed)
export { getIsLLMThinking, getMessages } from './model/selectors/getMessagesSelectors';
export { messagesReducer, messagesActions } from './model/slice/MessageSlice';

// New RTK Query based exports
export { useChatMessages } from './api/messagesApi';
export { useMessagesWithWebSocket } from './api/useMessagesWithWebSocket';
