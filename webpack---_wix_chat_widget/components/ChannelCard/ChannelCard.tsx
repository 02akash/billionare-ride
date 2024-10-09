import React from 'react';
import { Button } from 'wix-ui-tpa/cssVars';
import styles from './ChannelCard.scss';

export interface ChannelCardProps {
  description: string;
  buttonContent: React.ReactNode;
  buttonBackground: string;
  onButtonClick(): void;
}

export const ChannelCard: React.FunctionComponent<ChannelCardProps> = ({
  description,
  buttonContent,
  buttonBackground,
  onButtonClick,
}) => {
  return (
    <div className={styles.channelCard}>
      <p className={styles.description} data-hook="channel-description">
        {description}
      </p>
      <Button
        className={styles.button}
        style={{
          backgroundColor: buttonBackground,
        }}
        data-hook="channel-button"
        onClick={onButtonClick}
      >
        {buttonContent}
      </Button>
    </div>
  );
};
