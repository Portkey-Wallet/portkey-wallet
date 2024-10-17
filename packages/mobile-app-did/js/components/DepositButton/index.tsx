import React, { memo, useCallback } from 'react';
import { StyleProp, ViewProps } from 'react-native';
import OutlinedButton from 'components/OutlinedButton';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import {
  DEFAULT_DEPOSIT_TO_TOKEN_MAINNET,
  DEFAULT_DEPOSIT_TO_TOKEN_TESTNET,
} from '@portkey-wallet/constants/constants-ca/deposit';

type DepositButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
};

const DepositButton = (props: DepositButtonPropsType) => {
  const { t } = useLanguage();
  const { accountTokenList } = useAccountTokenInfo();
  const isMainnet = useIsMainnet();

  const onPress = useCallback(() => {
    const defaultToToken = isMainnet ? DEFAULT_DEPOSIT_TO_TOKEN_MAINNET : DEFAULT_DEPOSIT_TO_TOKEN_TESTNET;
    const toUnionToken = accountTokenList.find(item => item.symbol === defaultToToken.symbol);
    const toToken = toUnionToken?.tokens?.find(item => item.chainId === defaultToToken.chainId);
    navigationService.navigate('Deposit', toToken ?? defaultToToken);
  }, [accountTokenList, isMainnet]);

  return <OutlinedButton iconName="depositMain" title={t('Deposit')} onPress={onPress} />;
};

export default memo(DepositButton);
