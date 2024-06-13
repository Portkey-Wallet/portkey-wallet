import React, { memo, useCallback, useMemo, useRef } from 'react';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useGetCurrentCAContract } from 'hooks/contract';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import CommonToast from 'components/CommonToast';
import { commonButtonStyle } from 'components/SendButton/style';
import Touchable from 'components/Touchable';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';

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
        <Svg icon={'faucet'} size={pTd(48)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Faucet')}</TextM>
    </View>
  );
};

export default memo(FaucetButton);
