import React, { ComponentType, useMemo } from 'react';
import styles from './ChannelsPanel.scss';
import classNames from 'classnames';
import { ChannelType } from '@wix/ambassador-chat-channels-v1-channel/types';
import { useDesign } from '../../hooks/editor-settings';

export interface ChannelTab {
  name: string;
  type: ChannelType;
  icon: React.ReactNode;
  selectedIcon: React.ReactNode;
  component?: ComponentType<any>;
}

export interface ChannelsPanelProps {
  channels: ChannelTab[];
  onSelectedChannel(type: ChannelType): void;
  selectedChannel: ChannelType;
}

export const ChannelsPanel: React.FunctionComponent<ChannelsPanelProps> = ({
  channels,
  onSelectedChannel,
  selectedChannel,
}) => {
  const design = useDesign();

  const selecteBackgroundWidth = 100 / channels.length;
  const insetInlineStart = useMemo(
    () =>
      selecteBackgroundWidth *
      channels.findIndex((c) => c.type === selectedChannel),
    [channels, selecteBackgroundWidth, selectedChannel],
  );

  return (
    <div
      className={styles.channelsPanel}
      style={{ borderRadius: `${design.selectedRadiusOption}px` }}
      data-hook="channels-panel"
    >
      <div className={styles.channels} data-hook="channels">
        {Object.values(channels).map((channel) => (
          <button
            data-hook={`channel-${channel.type}`}
            aria-label={`channel-${channel.name}`}
            key={channel.type}
            className={classNames(styles.channel, {
              [styles.selected]: selectedChannel === channel.type,
            })}
            style={{ borderRadius: `${design.selectedRadiusOption}px` }}
            onClick={() => onSelectedChannel(channel.type)}
          >
            {selectedChannel === channel.type
              ? channel.selectedIcon
              : channel.icon}
          </button>
        ))}
      </div>
      <div
        className={styles.selectedChannelBackground}
        style={{
          borderRadius: `${design.selectedRadiusOption}px`,
          insetInlineStart: `calc(${insetInlineStart}% + 3px)`,
          width: `calc(${selecteBackgroundWidth}% - 6px)`,
        }}
      ></div>
    </div>
  );
};
