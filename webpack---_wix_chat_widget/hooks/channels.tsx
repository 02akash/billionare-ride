import React, { useState, useEffect } from 'react';
import {
  ChannelType,
  Channel,
} from '@wix/ambassador-chat-channels-v1-channel/types';
import { useAppState } from './app-state';
import {
  ChannelTab,
  ChannelsPanel,
} from '../components/ChannelsPanel/ChannelsPanel';
import { ReactComponent as WhatsappIcon } from '../assets/icons/channels/whatsapp.svg';
import { ReactComponent as ColoredWhatsappIcon } from '../assets/icons/channels/coloredWhatsapp.svg';
import { WhatsappScreen } from '../components/WhatsappScreen/WhatsappScreen';
import { getThumbnail } from '../components/ChatWidget/thumbnail';
import { useColors, useDesign } from './editor-settings';
import { useServices } from './services-registry';
import { useCollapseExpand } from './collapse-expand';
import { useChatSettings } from './chat-settings';
import styles from './channels.scss';
import { getIconComponent, isIcon } from '../components/MinimizedChat/icons';
import { ChatIcons } from '@wix/inbox-common';

export const CHAT_CHANNEL_TYPE = ChannelType.UNDEFINED;
const CHAT_CHANNEL_ICON_SIZE = '16px';

export const useChannels = () => {
  const { appState, updateAppState, isMobile } = useAppState();
  const design = useDesign();
  const { channelsColor } = useColors();
  const { hostSdk, biLogger } = useServices();
  const {
    chatSettings: { socialChatEnabled },
  } = useChatSettings();

  const thumbnailComponent = getThumbnailComponent(
    design,
    appState,
    hostSdk,
    channelsColor,
  );

  const WIDGET_CHANNELS: {
    CHAT: ChannelTab;
    WHATSAPP: ChannelTab;
  } = {
    CHAT: {
      name: 'chat',
      type: CHAT_CHANNEL_TYPE,
      icon: (
        <span
          style={{
            color: '#000000',
            height: CHAT_CHANNEL_ICON_SIZE,
          }}
        >
          {thumbnailComponent}
        </span>
      ),
      selectedIcon: (
        <span
          style={{
            color: channelsColor.value,
            height: CHAT_CHANNEL_ICON_SIZE,
          }}
        >
          {thumbnailComponent}
        </span>
      ),
    },
    WHATSAPP: {
      name: 'whatsapp',
      type: ChannelType.WHATSAPP,
      icon: <WhatsappIcon />,
      selectedIcon: <ColoredWhatsappIcon />,
      component: WhatsappScreen,
    },
  };

  const { isExpanded } = useCollapseExpand();

  const channels =
    appState.channels
      ?.map((channel) => channel.type && WIDGET_CHANNELS[channel.type])
      .filter((e) => !!e) || [];
  channels.unshift(WIDGET_CHANNELS.CHAT);

  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const updateSelectedChannel = (type: ChannelType) => {
    updateAppState({
      selectedChannel: type,
    });

    const channelName =
      type === ChannelType.UNDEFINED
        ? WIDGET_CHANNELS.CHAT.name
        : WIDGET_CHANNELS[type]?.name;

    if (channelName) {
      biLogger.channelToggleClicked(channelName, isMobile() ? 'mobile' : 'web');
    }
  };

  useEffect(() => {
    setSelectedChannel(
      appState.channels?.find(
        (channel) => channel.type === appState.selectedChannel,
      ),
    );
  }, [appState.channels, appState.selectedChannel]);

  useEffect(() => {
    if (!socialChatEnabled) {
      return () => {
        updateAppState({
          selectedChannel: WIDGET_CHANNELS.CHAT.type,
        });
      };
    }
  }, [isExpanded]);

  const channelsComponent =
    channels.length > 1
      ? ((
          <ChannelsPanel
            channels={channels}
            onSelectedChannel={updateSelectedChannel}
            selectedChannel={appState.selectedChannel}
          />
        ) as React.ReactNode)
      : undefined;

  const SelectedChannelTab = () => {
    const selected: ChannelTab = WIDGET_CHANNELS[appState.selectedChannel];
    const component = selected?.component;

    return component && selectedChannel ? (
      <div className={styles.channelTabWrapper}>
        {React.createElement(component, {
          data: selectedChannel?.data?.[selected.name],
        })}
      </div>
    ) : null;
  };

  return { selectedChannel, channelsComponent, SelectedChannelTab };
};

const getThumbnailComponent = (design, appState, hostSdk, channelsColor) => {
  const thumbnail = getThumbnail(
    design,
    appState.businessInfo?.image,
    false,
    false,
    hostSdk.getResizedImgUrl,
  );
  const borderRadiusForLegacyIcons = thumbnail?.startsWith('legacy-')
    ? '50%'
    : '0';
  const channelThumbnail =
    thumbnail && isIcon(thumbnail) ? thumbnail : ChatIcons.CircleFilled;

  return getIconComponent(
    channelThumbnail,
    channelsColor.value,
    CHAT_CHANNEL_ICON_SIZE,
    borderRadiusForLegacyIcons,
  );
};
