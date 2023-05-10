import React, { memo, useCallback, useRef } from 'react';
import Svg from 'components/Svg';
import { dashBoardBtnStyle, innerPageStyles } from './style';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

import { View, TouchableOpacity } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import CommonToast from 'components/CommonToast';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { request } from '@portkey-wallet/api/api-did';
import { getTxResult } from '@portkey-wallet/contracts/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getAelfInstance } from '@portkey-wallet/utils/aelf';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
}

const FaucetButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard' } = props;
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();

  const currentWallet = useCurrentWalletInfo();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const chainInfo = useCurrentChain('AELF');
  const isLoading = useRef<boolean>(false);

  const claimToken = useCallback(async () => {
    if (!currentWallet.address || !currentWallet.caHash || !currentNetworkInfo.tokenClaimContractAddress) return;

    let reCaptchaToken: string;
    try {
      reCaptchaToken = (await verifyHumanMachine('en')) as string;
      if (!reCaptchaToken) {
        throw new Error('reCaptchaToken is empty');
      }
    } catch (error) {
      CommonToast.warn(error as string);
      return;
    }

    CommonToast.loading('Your ELF is on its way');
    if (isLoading.current) return;
    isLoading.current = true;
    try {
      const { transactionId } = await request.token.getClaimToken({
        params: {
          symbol: 'ELF',
          amount: timesDecimals(100, 8).toString(),
          address: currentWallet.AELF?.caAddress,
        },
        headers: {
          reCaptchaToken: reCaptchaToken,
        },
      });
      if (!transactionId) {
        throw new Error('transactionId is empty');
      }

      if (!chainInfo?.endPoint) {
        throw new Error('chainInfo.endPoint is empty');
      }
      const aelfInstance = getAelfInstance(chainInfo.endPoint);
      const txResult = await getTxResult(aelfInstance, transactionId);
      if (!txResult || txResult.Status !== 'MINED') {
        throw new Error('txResult is error');
      }

      CommonToast.success(`Token successfully requested`);
    } catch (error) {
      console.log(error);
      CommonToast.warn(`Today's limit has been reached`);
    }
    isLoading.current = false;
  }, [
    chainInfo,
    currentNetworkInfo.tokenClaimContractAddress,
    currentWallet.AELF?.caAddress,
    currentWallet.address,
    currentWallet.caHash,
  ]);

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        style={[styles.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          if (isMainnet) return;
          claimToken();
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'faucet' : 'faucet1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Faucet')}</TextM>
    </View>
  );
};

export default memo(FaucetButton);
