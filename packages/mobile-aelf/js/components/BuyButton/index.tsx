import React, { memo, useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { StyleProp, ViewProps } from 'react-native';
import OutlinedButton, { TOutlinedStyleProps } from 'components/OutlinedButton';
import { useLanguage } from 'i18n/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';

type TSendButtonType = TOutlinedStyleProps & {
  wrapStyle?: StyleProp<ViewProps>;
  tokenInfo?: TokenItemShowType;
};

const BuyButton = (props: TSendButtonType) => {
  const { tokenInfo } = props;
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();

  const onPressButton = useCallback(() => {
    if (!isMainnet) {
      return;
    }
    navigationService.navigate('RampEntry', { symbol: tokenInfo ? tokenInfo.symbol : 'ELF' });
  }, [isMainnet, tokenInfo]);

  return <OutlinedButton {...props} iconName="buy" title={t('Buy')} onPress={onPressButton} />;
};

export default memo(BuyButton);
