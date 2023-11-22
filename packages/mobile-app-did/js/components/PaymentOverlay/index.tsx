import React, { useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import { pTd } from 'utils/unit';
import { ChainId } from '@portkey-wallet/types';
import { useAccountTokenList } from '@portkey-wallet/hooks/hooks-ca/balances';
import { TextL, TextM, TextTitle } from 'components/CommonText';
import { useGetAccountTokenList } from 'hooks/account';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import merge from 'lodash/merge';
import { useAsync } from 'react-use';
import { ViewResult } from '@portkey-wallet/contracts/types';
import LottieLoading from 'components/LottieLoading';
import GStyles from 'assets/theme/GStyles';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { divDecimals, formatAmountShow, formatAmountUSDShow } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TextS } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import CommonAvatar from 'components/CommonAvatar';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useCurrentCaInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Touchable from 'components/Touchable';
import { BGStyles } from 'assets/theme/styles';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import navigationService from 'utils/navigationService';
import { addressFormat } from '@portkey-wallet/utils';

export type PaymentTokenInfo = {
  symbol: string;
  decimals: number;
};

export type PaymentOverlayProps = {
  tokenInfo: PaymentTokenInfo;
  chainId: ChainId;
  amount: string;
  title: string;
  calculateTransactionFee: () => Promise<ViewResult>;
  onConfirm: (value: unknown) => void;
};

const PaymentModal = ({
  tokenInfo,
  chainId,
  amount,
  title,
  calculateTransactionFee,
  onConfirm,
}: PaymentOverlayProps) => {
  const getAccountTokenList = useGetAccountTokenList();
  const accountTokenList = useAccountTokenList();
  const defaultToken = useDefaultToken();
  const { currentNetwork } = useWallet();
  const currentCaInfo = useCurrentCaInfo();
  const currentCaAddress = useMemo(() => currentCaInfo?.[chainId]?.caAddress, [chainId, currentCaInfo]);
  useEffectOnce(() => {
    getAccountTokenList();
  });
  const [tokenMap, crossSufficientList] = useMemo(() => {
    const currentSymbolList: TokenItemShowType[] = [];
    const crossSufficient: TokenItemShowType[] = [];
    const map: { [key: string]: TokenItemShowType } = accountTokenList.reduce((acc, item) => {
      if (item.symbol === tokenInfo.symbol) {
        currentSymbolList.push(item);
        if (item.chainId !== chainId && divDecimals(item.balance, item.decimals).gte(amount))
          crossSufficient.push(item);
        return merge(acc, { [item.chainId]: item });
      }
      return acc;
    }, {});
    return [map, crossSufficient];
  }, [accountTokenList, amount, chainId, tokenInfo.symbol]);

  const crossSufficientItem = useMemo(() => crossSufficientList[0], [crossSufficientList]);

  const currentTokenInfo: TokenItemShowType | undefined = useMemo(() => tokenMap?.[chainId], [chainId, tokenMap]);
  console.log(tokenMap, currentTokenInfo, '=====tokenMap');

  const isMainNet = useMemo(() => chainId === MAIN_CHAIN_ID, [chainId]);
  console.log(isMainNet, '=====isMainNet');

  const fee = useAsync(async () => {
    const req = await calculateTransactionFee();
    if (req.error) throw req.error;
    if (!req.data.TransactionFee || !req.data.Success) throw new Error('TransactionFee calculate fail');
    return req.data.TransactionFee?.[defaultToken.symbol] || '0';
  }, [calculateTransactionFee]);
  const amountInUSD = useMemo(
    () => formatAmountUSDShow(ZERO.plus(amount).times(currentTokenInfo?.price || 0), 2),
    [amount, currentTokenInfo?.price],
  );

  const feeComponent = useMemo(() => {
    if (fee?.error) return;
    return (
      <View style={GStyles.width100}>
        <View style={[GStyles.flexRow, GStyles.spaceBetween]}>
          <TextL>Transaction fee</TextL>
          <View>
            <View style={[GStyles.flexRow, GStyles.itemCenter]}>
              {fee?.loading ? (
                <LottieLoading lottieWrapStyle={styles.lottieWrapStyle} lottieStyle={styles.lottieStyle} />
              ) : (
                <TextM>{formatAmountShow(divDecimals(fee.value, defaultToken.decimals), defaultToken.decimals)}</TextM>
              )}
              <TextM>{defaultToken.symbol}</TextM>
            </View>
          </View>
        </View>
        <View style={GStyles.alignEnd}>
          <TextS>$ {formatAmountUSDShow(ZERO.plus(fee.value).times(currentTokenInfo?.price || 0), 2)}</TextS>
        </View>
      </View>
    );
  }, [fee, defaultToken, currentTokenInfo]);

  const getButtonComponent = useMemo(() => {
    if (!fee.error) return;
    let buttonTitle = '',
      onPress;
    if (crossSufficientItem) {
      // TODO: go back
      buttonTitle = 'Get ELF';
      onPress = async () => {
        OverlayModal.hide(false);
        navigationService.navigateByMultiLevelParams('SendHome', {
          params: {
            assetInfo: crossSufficientItem,
            toInfo: {
              address: addressFormat(currentCaAddress, chainId),
            },
          },
          // multiLevelParams
          multiLevelParams: {
            successNavigateName: '123',
          },
        });
      };
    } else if (isMainNet) {
      // TODO: go back
      buttonTitle = 'Buy ELF';
      onPress = () => {
        OverlayModal.hide(false);
        navigationService.navigateByMultiLevelParams('BuyHome', {
          // multiLevelParams
          multiLevelParams: {
            successNavigateName: '123',
          },
        });
      };
    }
    if (!buttonTitle) return;
    return (
      <Touchable onPress={onPress} style={styles.getButtonRow}>
        <TextS style={[FontStyles.weight500, FontStyles.font11]}>{buttonTitle}</TextS>
      </Touchable>
    );
  }, [chainId, crossSufficientItem, currentCaAddress, fee.error, isMainNet]);
  return (
    <ModalBody modalBodyType="bottom" style={styles.wrapStyle}>
      <View style={[GStyles.itemCenter, GStyles.flex1]}>
        <TextTitle>{title}</TextTitle>
        <TextTitle>
          {amount} {tokenInfo.symbol}
        </TextTitle>
        <TextL>${amountInUSD}</TextL>
        <View style={GStyles.width100}>
          <TextS>Balance</TextS>
          <View style={styles.balanceItemRow}>
            <View style={styles.rowCenter}>
              <View style={[GStyles.flex1, styles.rowCenter]}>
                <CommonAvatar avatarSize={pTd(30)} imageUrl={currentTokenInfo?.imageUrl} />
                <TextL>ELF ({formatChainInfoToShow(chainId, currentNetwork)})</TextL>
              </View>
              {getButtonComponent}
            </View>
            <View style={GStyles.paddingLeft(pTd(30))}>
              {!!fee.error && <TextS>Not enough balance</TextS>}
              {!!(crossSufficientItem && fee.error) && (
                <TextS style={FontStyles.font6}>
                  You can get {tokenInfo.symbol} from{' '}
                  {formatChainInfoToShow(crossSufficientItem.chainId, currentNetwork)}
                </TextS>
              )}
            </View>
          </View>
        </View>
        {feeComponent}
      </View>
      <CommonButton
        onPress={() => {
          OverlayModal.hide();
          onConfirm(true);
        }}
        disabled={!!(fee.loading || fee.error)}
        loading={fee.loading}
        type="primary">
        Confirm
      </CommonButton>
    </ModalBody>
  );
};

export const show = (props: Omit<PaymentOverlayProps, 'onConfirm'>) => {
  return new Promise((resolve, reject) => {
    OverlayModal.show(<PaymentModal {...props} onConfirm={resolve} />, {
      position: 'bottom',
      onDisappearCompleted: () => reject(new Error('user cancelled')),
    });
  });
};

export const showRedPacket = (props: PaymentOverlayProps) => {
  return show(props);
};

export default {
  show,
  showRedPacket,
};

export const styles = StyleSheet.create({
  wrapStyle: {
    paddingHorizontal: pTd(20),
    paddingVertical: 8,
  },
  lottieStyle: {
    width: 15,
    height: 15,
  },
  lottieWrapStyle: { paddingRight: 10, paddingTop: 0 },
  getButtonRow: {
    ...BGStyles.bg5,
    paddingHorizontal: pTd(8),
    paddingVertical: 4,
    borderRadius: pTd(6),
  },
  balanceItemRow: {
    backgroundColor: defaultColors.bg6,
    paddingVertical: 15,
    paddingHorizontal: pTd(12),
    borderRadius: pTd(6),
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
