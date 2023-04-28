import { defaultColors } from 'assets/theme';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextS } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import { CryptoItemType } from '../types';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import Svg from 'components/Svg';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { useGetCurrentCAContract } from 'hooks/contract';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import { useTestAmountPrice } from '../hooks';
import { TOKEN_CLAIM_CONTRACT_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/payment';

interface RouterParams {
  token?: CryptoItemType;
  fiat?: FiatType;
  amount?: string;
  receiveAmount: number;
  rate?: string;
}

export default function BuyConfirm() {
  const { token, fiat, amount: amountProps, receiveAmount } = useRouterParams<RouterParams>();

  const { t } = useLanguage();
  const currentWallet = useCurrentWalletInfo();
  const currentCaAddress = currentWallet?.AELF?.caAddress;

  const { amount } = useTestAmountPrice(receiveAmount, fiat, token, amountProps);

  // tokenClaimContract deploy in AELF
  const getCurrentCAContract = useGetCurrentCAContract(TOKEN_CLAIM_CONTRACT_CHAIN_ID);
  const currentNetworkInfo = useCurrentNetworkInfo();
  const handleTokenClaim = useCallback(async () => {
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
      navigationService.navigate('Tab');
    } catch (error) {
      console.log(error);
      CommonToast.fail(`Today's limit has been reached.`);
    } finally {
      Loading.hide();
    }
  }, [currentNetworkInfo.tokenClaimContractAddress, currentWallet.address, currentWallet.caHash, getCurrentCAContract]);

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Confirm Payment')}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <TextS style={[FontStyles.font3, GStyles.marginLeft(8)]}>Pay with</TextS>
        <View style={styles.paymentWrap}>
          <Svg icon="visa" oblongSize={[pTd(32), pTd(16)]} iconStyle={styles.paymentIcon} />
          <View style={styles.paymentContent}>
            <TextL>Visa Card</TextL>
            <TextM style={[FontStyles.font3, GStyles.marginLeft(8)]}>(****7760)</TextM>
          </View>
        </View>

        <TextS style={[FontStyles.font3, GStyles.marginLeft(8), GStyles.marginTop(24)]}>Wallet address</TextS>
        <View style={styles.labelWrap}>
          <TextM>{formatStr2EllipsisStr(`ELF_${currentCaAddress}_AELF`, 16)}</TextM>
        </View>

        <TextS style={[FontStyles.font3, GStyles.marginLeft(8), GStyles.marginTop(24)]}>You will get</TextS>
        <View style={styles.labelWrap}>
          <TextM>
            {receiveAmount} {token?.crypto} for {amount} {fiat?.currency}
          </TextM>
        </View>
      </View>

      <CommonButton type="primary" onPress={handleTokenClaim}>
        Confirm
      </CommonButton>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 16, 20),
  },

  paymentWrap: {
    marginTop: pTd(8),
    borderRadius: pTd(6),
    borderColor: defaultColors.border6,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(72),
    ...GStyles.paddingArg(0, 12),
  },
  paymentIcon: {
    marginRight: pTd(16),
    borderColor: defaultColors.border6,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(6),
    ...GStyles.paddingArg(pTd(6), pTd(6)),
  },
  paymentContent: {
    flex: 1,
    flexDirection: 'row',
  },
  labelWrap: {
    height: pTd(56),
    borderRadius: pTd(6),
    borderColor: defaultColors.border6,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    marginTop: pTd(8),
    ...GStyles.paddingArg(0, 12),
  },
});
