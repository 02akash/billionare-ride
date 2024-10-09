import { WhatsappData } from '@wix/ambassador-chat-channels-v1-channel/types';
import { useTranslation } from '@wix/wix-i18n-config';
import React from 'react';
import { useAppState } from '../../hooks/app-state';
import { useServices } from '../../hooks/services-registry';
import { useTheme } from '../../hooks/theme';
import { ChannelCard } from '../ChannelCard/ChannelCard';
import ExternalLinkSmall from 'wix-ui-icons-common/on-stage/ExternalLinkSmall';
import styles from './WhatsappScreen.scss';

export interface WhatsappScreenProps {
  data: WhatsappData;
}

export const WhatsappScreen: React.FunctionComponent<WhatsappScreenProps> = ({
  data,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { biLogger } = useServices();
  const { isMobile } = useAppState();

  const backgroundColor = theme.chatWeb.room.background;
  const backgroundImage = theme.chatWeb.room.pattern.asset;
  const backgroundSize = theme.chatWeb.room.pattern.backgroundSize;
  const fontFamily = theme.chatWeb.room.fontFamily;

  const onButtonClick = () => {
    biLogger.openWhatsappButtonClicked(isMobile() ? 'mobile' : 'web');
    const normalizedPhoneNumber = data?.phone?.replace(/[\s().-]/g, '') || '';

    window.open(
      `https://wa.me/${normalizedPhoneNumber}?text=${data?.introMessage}`,
      '_blank',
    );
  };
  const whatsappColor = '#4E9A8C';
  return (
    <div
      className={styles.whatsappScreen}
      style={{
        backgroundColor,
        backgroundImage,
        backgroundSize,
        fontFamily,
      }}
    >
      <div className={styles.cardWrapper}>
        <ChannelCard
          onButtonClick={onButtonClick}
          buttonContent={
            <div className={styles.openWhatsappButton}>
              {t('channels.whatsapp.open')}
              <ExternalLinkSmall className={styles.externalIcon} />
            </div>
          }
          description={data?.description || ''}
          buttonBackground={whatsappColor}
        ></ChannelCard>
      </div>
    </div>
  );
};
