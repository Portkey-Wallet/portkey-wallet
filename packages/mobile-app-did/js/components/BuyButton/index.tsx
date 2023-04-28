import React, { memo, useCallback } from 'react';
import Svg from 'components/Svg';
import { dashBoardBtnStyle, innerPageStyles } from './style';
import navigationService from 'utils/navigationService';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

import { View, TouchableOpacity } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import { TOKEN_CLAIM_CONTRACT_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/payment';
import { useGetCurrentCAContract } from 'hooks/contract';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import CommonToast from 'components/CommonToast';
interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
}

const BuyButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard' } = props;
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();

  const currentWallet = useCurrentWalletInfo();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const getCurrentCAContract = useGetCurrentCAContract(TOKEN_CLAIM_CONTRACT_CHAIN_ID);
  const claimToken = useCallback(async () => {
    if (!currentWallet.address || !currentWallet.caHash || !currentNetworkInfo.tokenClaimContractAddress) return;
    Loading.show();
    try {
      const caContract = await getCurrentCAContract();
      const rst = await caContract.callSendMethod('ManagerForwardCall', currentWallet.address, {
        caHash: currentWallet.caHash,
        contractAddress: currentNetworkInfo.tokenClaimContractAddress,
        methodName: 'ClaimToken',
        args: {
          symbol: 'ELF',
          amount: timesDecimals(100, 8).toString(),
        },
      });
      if (rst.error) {
        throw rst.error;
      }
      // navigationService.navigate('Tab');
    } catch (error) {
      console.log(error);
      CommonToast.fail(`Today's limit has been reached.`);
    } finally {
      Loading.hide();
    }
  }, [currentNetworkInfo.tokenClaimContractAddress, currentWallet.address, currentWallet.caHash, getCurrentCAContract]);

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        style={[styles.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          if (isMainnet) {
            navigationService.navigate('BuyHome');
          } else {
            claimToken();
          }
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'buy' : 'buy1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Buy')}</TextM>
    </View>
  );
};

export default memo(BuyButton);
