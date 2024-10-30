import React, { memo, useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { StyleProp, ViewProps } from 'react-native';
import OutlinedButton from 'components/OutlinedButton';
import { useLanguage } from 'i18n/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { ReceivePageTabType } from 'pages/Receive/types';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
  tokenInfo?: TokenItemShowType;
}

const BuyButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', tokenInfo } = props;
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();

  const onPressButton = useCallback(() => {
    if (!isMainnet) return;
    if (themeType === 'innerPage') {
      navigationService.navigate('Receive', Object.assign({}, tokenInfo, { targetScene: ReceivePageTabType.BUY }));
    } else {
      navigationService.navigate('RampHome', { symbol: tokenInfo ? tokenInfo.symbol : 'ELF' });
    }
  }, [isMainnet, themeType, tokenInfo]);

  return <OutlinedButton iconName="buy" title={t('Buy')} onPress={onPressButton} />;
};

export default memo(BuyButton);
