import {
  chatEventEmitter,
  DeliveryMethodId,
  IMessage,
  Subscription,
} from '@wix/chat-sdk';
import { ON_NEW_MESSAGE } from '@wix/inbox-common';
import { useEffect, useCallback } from 'react';
import { DeviceType, ViewMode } from '../types/host-sdk';
import { useAppState } from './app-state';
import { useCollapseExpand } from './collapse-expand';
import { useBehaviour } from './editor-settings';
import {
  useSenderIdentity,
  useSenderData,
  WidgetSenderIdentityType,
} from './chat-settings';

export const useNewMessageHandler = (
  isSdkLoaded: boolean,
  isMembersChat: boolean,
) => {
  useSubscribeAndUpdate(isSdkLoaded, isMembersChat);
  useResetOnExpand(isMembersChat);
  useCollapseToPopup();
};

const useSubscribeAndUpdate = (
  isSdkLoaded: boolean,
  isMembersChat: boolean,
) => {
  const collapseExpand = useCollapseExpand();
  const { appState, updateAppState } = useAppState();
  const senderIdentity = useSenderIdentity();
  const senderData = useSenderData();

  const { onNewMessage: onNewMessageSetting } = useBehaviour();

  const isAMessageFromAChat = (message?: IMessage) => {
    return (
      !message ||
      message.deliveryMethods?.includes(DeliveryMethodId.Chat) ||
      message.originMethod === DeliveryMethodId.Chat
    );
  };

  const isAMessageWithoutAnyDeliveryOrOrigin = (message?: IMessage) =>
    (!message?.deliveryMethods || message?.deliveryMethods?.length === 0) &&
    !message?.originMethod;

  const onNewMessage = useCallback(
    async (message?: IMessage) => {
      if (collapseExpand.isExpanded || !isSdkLoaded) {
        return;
      }

      const chatroomId = message?.chatroomId
        ? message.chatroomId
        : appState.chatroomId!;

      const { chatSdk } = await import(
        /* webpackChunkName: "chat-sdk" */ '@wix/chat-sdk'
      );
      await chatSdk.fetchRooms({ filter: undefined, cursor: undefined });
      const chatroom = await chatSdk.getChatroom({
        chatroomId,
      });

      const temporaryChatAndNoNewMessage = chatroom.isTemporary && !message;
      const shouldNotifyAboutNewMessage =
        (isAMessageFromAChat(message) ||
          isAMessageWithoutAnyDeliveryOrOrigin(message)) &&
        !temporaryChatAndNoNewMessage &&
        chatroom.count > 0 &&
        chatroom.count !== appState.unreadCount;

      if (shouldNotifyAboutNewMessage) {
        if (
          onNewMessageSetting === ON_NEW_MESSAGE.EXPAND &&
          appState.deviceType !== DeviceType.Mobile
        ) {
          collapseExpand.expand();
        } else {
          const unreadCount =
            message && appState.unreadCount
              ? Number(appState.unreadCount) + 1
              : chatroom.count;
          const maybeUnreadCount = !isMembersChat ? { unreadCount } : {};

          updateAppState({
            ...maybeUnreadCount,
            showMessagePopup: true,
            messagePopupLastUnreadMessage: chatroom.lastMessage?.summary,
            messagePopupSenderName:
              chatroom.id === appState.chatroomId &&
              senderIdentity === WidgetSenderIdentityType.BUSINESS
                ? senderData[0]?.name
                : chatroom.lastMessage?.senderDisplayData?.name,
          });
        }
      }
    },
    [
      collapseExpand.isExpanded,
      isSdkLoaded,
      appState.unreadCount,
      senderIdentity,
      senderData,
    ],
  );

  useEffect(() => {
    // Don't subscribe to new messages when in editor
    // See bug: https://jira.wixpress.com/browse/INBOX-62
    const isInEditingExperience = appState.viewMode() === ViewMode.Editor;
    if (isInEditingExperience) {
      return;
    }

    const subscribeToRealtimeMessages = () =>
      chatEventEmitter.addListener(
        chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
        onNewMessage,
      );
    const unsubscribeFromRealtimeMessages = () =>
      chatEventEmitter.removeListener(
        chatEventEmitter.CHAT_EVENTS.NEW_REALTIME_MESSAGE,
        onNewMessage,
      );

    void onNewMessage();

    subscribeToRealtimeMessages();

    let globalUnreadSubscription: Subscription | undefined;
    const visitorId = appState.visitorId;

    if (isMembersChat && isSdkLoaded && visitorId) {
      void (async () => {
        const { chatSdk } = await import(
          /* webpackChunkName: "chat-sdk" */ '@wix/chat-sdk'
        );
        const handler = {
          callback: ({ count }) => {
            updateAppState({ unreadCount: count });
          },
          filter: {
            participantIds: [visitorId],
          },
        };
        globalUnreadSubscription =
          chatSdk.subscribeToGlobalUnreadStatus(handler);
      })();
    }

    return () => {
      unsubscribeFromRealtimeMessages();
      globalUnreadSubscription?.unsubscribe();
    };
  }, [isSdkLoaded, appState.visitorId, collapseExpand.isExpanded]);
};

const useResetOnExpand = (isMembersChat: boolean) => {
  const { updateAppState } = useAppState();
  const collapseExpand = useCollapseExpand();

  useEffect(() => {
    if (collapseExpand.isExpanded) {
      const maybeResetUnreadCount = !isMembersChat
        ? { unreadCount: undefined }
        : {};
      updateAppState({ ...maybeResetUnreadCount, showMessagePopup: false });
    }
  }, [collapseExpand.isExpanded]);
};

const useCollapseToPopup = () => {
  const { appState } = useAppState();
  const collapseExpand = useCollapseExpand();

  useEffect(() => {
    if (collapseExpand.isCollapsed && appState.showMessagePopup) {
      collapseExpand.collapse();
    }
  }, [collapseExpand.isCollapsed, appState.showMessagePopup]);
};
