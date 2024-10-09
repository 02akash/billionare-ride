import { IChatroom } from '@wix/chat-sdk';
import constate from 'constate';
import { useCallback, useMemo, useState } from 'react';
import {
  Channel,
  ChannelType,
} from '@wix/ambassador-chat-channels-v1-channel/types';
import { DeviceType, ViewMode } from '../types/host-sdk';
import { hocify } from './utils';
import { CHAT_CHANNEL_TYPE } from './channels';
import { AvailabilityStatus } from '../types/availability-status';

export interface AppState {
  coreChatToken?: string;
  businessChatroomId?: string;
  chatroomId?: string;
  instance?: string;
  instanceId?: string;
  visitorId?: string;
  visitorInstanceId?: string;
  shardId?: string;
  host: string;
  siteLanguage: string;
  correlationId?: string;
  deviceType: DeviceType;
  viewMode: () => ViewMode;
  availabilityStatus?: AvailabilityStatus;
  chatInstallationDate?: number;
  withQab: boolean;
  businessInfo: {
    name?: string;
    image?: string;
  };
  language: string;
  locale: string;
  isPrimaryLanguage: boolean;
  isBranded?: boolean;
  isLCFMandatory: boolean;
  isOfflineLCFMandatory: boolean;
  isContact: boolean;
  unreadCount: number;
  disableAutoMessages: boolean;
  hasMessages: boolean;
  wasAwayMessageSent: boolean;
  wasLCFSent: boolean;
  isVisible: boolean;
  showMessagePopup: boolean;
  messagePopupSenderName?: string;
  messagePopupLastUnreadMessage?: string;
  firebase?: {
    authKey: string;
    options: any;
    presencePath: string;
  };
  location?: string;
  timestamp?: string;
  isBot: boolean;
  editorSettingsLoaded: boolean;
  currentChatroom?: IChatroom;
  activeSocialMemberId?: string;
  activeSocialChatroomId?: string;
  channels?: Channel[];
  selectedChannel: ChannelType;
  oldViewMode?: ViewMode;
}

export interface InjectedAppStateProps {
  appState: AppState;
  updateAppState(propsToUpdate: Partial<AppState>): void;
  setAppState(newAppState: AppState): void;
}

interface ProviderProps {
  appState: AppState;
}

export const calculateAllowInput = ({
  availabilityStatus,
  isContact,
  isLCFMandatory,
  isOfflineLCFMandatory,
  selectedChannel,
  currentChatroom,
  businessChatroomId,
}: Pick<
  AppState,
  | 'availabilityStatus'
  | 'isContact'
  | 'isLCFMandatory'
  | 'isOfflineLCFMandatory'
  | 'selectedChannel'
  | 'currentChatroom'
  | 'businessChatroomId'
>) => {
  const isAvailable = availabilityStatus === AvailabilityStatus.Available;
  const isChatChannel = selectedChannel === CHAT_CHANNEL_TYPE;
  const isInMemberChat =
    !!currentChatroom && currentChatroom.id !== businessChatroomId;
  return (
    (isContact ||
      (isAvailable && !isLCFMandatory) ||
      (!isAvailable && !isOfflineLCFMandatory)) &&
    (isChatChannel || isInMemberChat)
  );
};

const useValue = ({ appState }: ProviderProps) => appState;

const useAppState_ = (initialAppState: AppState) => {
  const [appState, setAppState] = useState<AppState>(initialAppState);

  const updateAppState = useCallback(
    (newAppState: Partial<AppState>) =>
      setAppState((prevState) => ({
        ...prevState,
        ...newAppState,
      })),
    [appState],
  );

  const allowInput = useMemo(() => {
    const {
      availabilityStatus,
      isContact,
      isLCFMandatory,
      selectedChannel,
      isOfflineLCFMandatory,
      currentChatroom,
      businessChatroomId,
    } = appState;
    return calculateAllowInput({
      availabilityStatus,
      isContact,
      isLCFMandatory,
      isOfflineLCFMandatory,
      selectedChannel,
      currentChatroom,
      businessChatroomId,
    });
  }, [
    appState.isContact,
    appState.availabilityStatus,
    appState.isLCFMandatory,
    appState.isOfflineLCFMandatory,
    appState.selectedChannel,
    appState.currentChatroom,
  ]);

  const isMobile = () => appState.deviceType === DeviceType.Mobile;

  return { appState, setAppState, updateAppState, allowInput, isMobile };
};

export const [AppStateProvider, useAppState] = constate(useValue, useAppState_);

export const withAppState = hocify(useAppState);
