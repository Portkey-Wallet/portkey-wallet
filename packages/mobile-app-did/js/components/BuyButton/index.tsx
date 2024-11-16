import React, { memo, useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { StyleProp, ViewProps } from 'react-native';
import OutlinedButton from 'components/OutlinedButton';
import { useLanguage } from 'i18n/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

interface SendButtonType {
  wrapStyle?: StyleProp<ViewProps>;
  tokenInfo?: TokenItemShowType;
}

const BuyButton = (props: SendButtonType) => {
  const { tokenInfo } = props;
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();

  const onPressButton = useCallback(() => {
    if (!isMainnet) {
      return;
    }
    navigationService.navigate('RampEntry', { symbol: tokenInfo ? tokenInfo.symbol : 'ELF' });
  }, [isMainnet, tokenInfo]);

  return <OutlinedButton iconName="buy" title={t('Buy')} onPress={onPressButton} />;
};

export default memo(BuyButton);
