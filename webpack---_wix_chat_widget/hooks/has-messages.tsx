import { chatEventEmitter } from '@wix/chat-sdk';
import { useCallback, useEffect } from 'react';
import { useAppState } from './app-state';

export const useHasMessages = () => {
  const {
    appState: { chatroomId },
    updateAppState,
  } = useAppState();

  useEffect(() => {
    return () => updateAppState({ hasMessages: false });
  }, [chatroomId]);

  const setHasMessagesTrue = useCallback((message) => {
    updateAppState({ hasMessages: true });
  }, []);

  useEffect(() => {
    chatEventEmitter.addListener(
      chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
      setHasMessagesTrue,
    );

    return () =>
      chatEventEmitter.removeListener(
        chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
        setHasMessagesTrue,
      );
  }, []);
};
