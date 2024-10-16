import React, { useCallback } from 'react';
import { StyleProp, ViewProps } from 'react-native';
import navigationService from 'utils/navigationService';
import OutlinedButton from 'components/OutlinedButton';
import { useLanguage } from 'i18n/hooks';
import TokenOverlay from 'components/TokenOverlay';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

interface SendButtonType {
  currentTokenInfo?: TokenItemShowType;
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
}

export default function ReceiveButton(props: SendButtonType) {
  const { themeType = 'dashBoard', currentTokenInfo = {} } = props;
  const { t } = useLanguage();

  const onPressButton = useCallback(() => {
    if (themeType === 'innerPage') return navigationService.navigate('Receive', currentTokenInfo);

    TokenOverlay.showTokenList({
      onFinishSelectToken: (tokenInfo: TokenItemShowType) => {
        navigationService.navigate('Receive', tokenInfo);
      },
    });
  }, [currentTokenInfo, themeType]);

  return <OutlinedButton iconName="receive" title={t('Receive')} onPress={onPressButton} />;
}
