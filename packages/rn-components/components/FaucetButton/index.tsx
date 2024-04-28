import React, { memo, useCallback, useMemo, useRef } from 'react';
import Svg from '../Svg';

import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from '../CommonText';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useGetCurrentCAContract } from '@portkey-wallet/rn-base/hooks/contract';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import CommonToast from '../CommonToast';
import { useStyles } from '../SendButton/style';
import Touchable from '../Touchable';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
}

const FaucetButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', wrapStyle = {} } = props;
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();

  const currentWallet = useCurrentWalletInfo();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const getCurrentCAContract = useGetCurrentCAContract(DefaultChainId);
  const isLoading = useRef<boolean>(false);
  const commonButtonStyle = useStyles();

  const buttonTitleStyle = useMemo(
    () =>
      themeType === 'dashBoard'
        ? commonButtonStyle.dashBoardTitleColorStyle
        : commonButtonStyle.innerPageTitleColorStyle,
    [themeType],
  );

  const claimToken = useCallback(async () => {
    if (!currentWallet.address || !currentWallet.caHash || !currentNetworkInfo.tokenClaimContractAddress) return;
    CommonToast.loading('Your ELF is on its way');

    if (isLoading.current) return;
    isLoading.current = true;
    try {
      const caContract = await getCurrentCAContract();
      const rst = await caContract.callSendMethod('ManagerForwardCall', currentWallet.address, {
        caHash: currentWallet.caHash,
        contractAddress: currentNetworkInfo.tokenClaimContractAddress,
        methodName: 'ClaimToken',
        args: {
          symbol: 'ELF',
          amount: timesDecimals(100, 8).toFixed(0),
        },
      });
      if (rst.error) {
        throw rst.error;
      }
      CommonToast.success(`Token successfully requested`);
    } catch (error) {
      console.log(error);
      CommonToast.warn(`Today's limit has been reached`);
    }
    isLoading.current = false;
  }, [currentNetworkInfo.tokenClaimContractAddress, currentWallet.address, currentWallet.caHash, getCurrentCAContract]);

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <Touchable
        style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          if (isMainnet) return;
          claimToken();
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'faucet' : 'faucet1'} size={pTd(48)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Faucet')}</TextM>
    </View>
  );
};

export default memo(FaucetButton);
