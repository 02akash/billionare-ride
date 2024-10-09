import { useEffect, useState } from 'react';
import { loadingScheduler } from '../services/loading-scheduler';
import { chatEventEmitter } from '@wix/chat-sdk';
import { useCorvidApi } from './corvid-api';
import { useAppState } from './app-state';
import { CHAT_DEF_ID } from '../constants';

export const useInitChatSdk = ({ coreChatToken, experiments, instance }) => {
  const [isSdkLoaded, setSdkLoaded] = useState(false);
  const { appState } = useAppState();
  const corvidApi = useCorvidApi();

  useEffect(() => {
    const onNewRealtimeMessage = (message) =>
      corvidApi.reportMessageReceived(message);

    void loadingScheduler.onInteractive().then(async () => {
      if (!coreChatToken) {
        return;
      }
      const linguistHeader = [
        appState.language,
        appState.locale,
        appState.isPrimaryLanguage,
        appState.instanceId,
      ].join('|');

      const chatSdk = await import(
        /* webpackChunkName: "chat-sdk" */ '@wix/chat-sdk'
      );

      const isPresenceOverDuplexerEnabled = experiments
        ? experiments['specs.PresenceOverDuplexerSpec'] === 'true'
        : false;

      chatSdk.chatSdk.init({
        chatServerUrl: location.origin,
        chatToken: coreChatToken,
        preFetch: false,
        experiments,
        httpHeaders: {
          'x-wix-linguist': linguistHeader,
        },
        tokenServer: instance // TODO: Hack to bypass testkit issues
          ? { url: '/_api', authorization: instance, isForUnifiedList: false }
          : undefined,
        presenceOptions: {
          useNewConvention: false,
          disableWatch: isPresenceOverDuplexerEnabled,
        },
        appId: CHAT_DEF_ID,
      });

      chatEventEmitter.addListener(
        chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
        onNewRealtimeMessage,
      );

      setSdkLoaded(true);
      loadingScheduler.triggerConnectivity();
    });

    return () => {
      void loadingScheduler.onInteractive().then(async () => {
        if (!coreChatToken) {
          return;
        }

        chatEventEmitter.removeListener(
          chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
          onNewRealtimeMessage,
        );

        const chatSdk = await import(
          /* webpackChunkName: "chat-sdk" */ '@wix/chat-sdk'
        );
        chatSdk.chatSdk.disconnect();

        setSdkLoaded(false);
      });
    };
  }, [loadingScheduler, coreChatToken, experiments, instance]);

  return isSdkLoaded;
};
