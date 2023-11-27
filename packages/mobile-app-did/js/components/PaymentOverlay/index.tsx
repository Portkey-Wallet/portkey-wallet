import React, { useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View, Text } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import { pTd } from 'utils/unit';
import { ChainId } from '@portkey-wallet/types';
import { useAccountTokenList, useAllTokenInfoList } from '@portkey-wallet/hooks/hooks-ca/balances';
import { TextL, TextM } from 'components/CommonText';
import { useGetAccountTokenList, useGetAllTokenInfoList } from 'hooks/account';
import { useEffectOnce } from '@portkey-wallet/hooks';
import merge from 'lodash/merge';
import { useAsync } from 'react-use';
import { ViewResult } from '@portkey-wallet/contracts/types';
import LottieLoading from 'components/LottieLoading';
import GStyles from 'assets/theme/GStyles';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { convertAmountUSDShow, divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
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
import { useAppBuyButtonShow } from 'hooks/cms';
import RedPacketAmountShow from 'pages/Chat/components/RedPacketAmountShow';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';

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
  const accountTokenList = useAccountTokenList();
  const tokenInfoList = useAllTokenInfoList();

  const getAccountTokenList = useGetAccountTokenList();
  const allTokenInfoList = useGetAllTokenInfoList();

  const defaultToken = useDefaultToken();
  const { currentNetwork } = useWallet();

  const currentCaInfo = useCurrentCaInfo();
  const currentCaAddress = useMemo(() => currentCaInfo?.[chainId]?.caAddress, [chainId, currentCaInfo]);

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
  const currentTokenInfo: TokenItemShowType | undefined = useMemo(() => {
    if (tokenMap?.[chainId]) return tokenMap?.[chainId];

    return tokenInfoList.find(ele => ele.symbol === tokenInfo.symbol);
  }, [chainId, tokenInfo.symbol, tokenInfoList, tokenMap]);

  const { isBuySectionShow } = useAppBuyButtonShow();
  const isCanBuy = useMemo(
    () => tokenInfo.symbol === defaultToken.symbol && isBuySectionShow,
    [isBuySectionShow, defaultToken.symbol, tokenInfo.symbol],
  );

  // update AccountTokenList
  useEffectOnce(() => {
    getAccountTokenList();
    allTokenInfoList();
  });

  const fee = useAsync(async () => {
    const req = await calculateTransactionFee();
    if (req.error) throw req.error;
    if (!req.data.TransactionFee || !req.data.Success) throw new Error('TransactionFee calculate fail');
    return req.data.TransactionFee?.[defaultToken.symbol] || '0';
  }, [calculateTransactionFee]);

  const feeComponent = useMemo(() => {
    if (fee?.error) return;
    return (
      <View style={[GStyles.width100, GStyles.marginTop(pTd(16))]}>
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
          <TextS>{convertAmountUSDShow(divDecimals(fee.value, defaultToken.decimals), currentTokenInfo?.price)}</TextS>
        </View>
      </View>
    );
  }, [fee, defaultToken, currentTokenInfo]);

  const getButtonComponent = useMemo(() => {
    if (!fee.error) return;
    let buttonTitle = '',
      onPress;
    if (crossSufficientItem) {
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
          // TODO: multiLevelParams
          multiLevelParams: {
            successNavigateName: '123',
          },
        });
      };
    } else if (isCanBuy) {
      buttonTitle = 'Buy ELF';
      onPress = () => {
        OverlayModal.hide(false);
        navigationService.navigateByMultiLevelParams('BuyHome', {
          // TODO: multiLevelParams
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
  }, [chainId, crossSufficientItem, currentCaAddress, fee.error, isCanBuy]);

  return (
    <ModalBody modalBodyType="bottom" style={styles.wrapStyle}>
      <View style={[GStyles.itemCenter, GStyles.flex1]}>
        <TextM style={[FontStyles.font5, GStyles.marginBottom(pTd(8))]}> {title}</TextM>
        <RedPacketAmountShow
          componentType="sendPacketPage"
          textColor={defaultColors.font5}
          amountShow={amount}
          symbol={tokenInfo.symbol}
        />
        <TextL style={GStyles.marginTop(pTd(8))}>{convertAmountUSDShow(amount, currentTokenInfo?.price)}</TextL>
        <View style={[GStyles.marginTop(pTd(40)), GStyles.width100]}>
          <TextS style={FontStyles.font3}>Method</TextS>
          <View style={[styles.balanceItemRow, (crossSufficientItem || fee.error) && styles.opacity]}>
            <View style={styles.rowCenter}>
              <View style={[GStyles.flex1, styles.rowCenter]}>
                <CommonAvatar
                  hasBorder
                  style={styles.avatar}
                  title={currentTokenInfo?.symbol}
                  avatarSize={pTd(24)}
                  imageUrl={currentTokenInfo?.imageUrl}
                />
                <TextL style={FontStyles.font5}>
                  {tokenInfo.symbol} ({formatChainInfoToShow(chainId, currentNetwork)})
                </TextL>
              </View>
              {getButtonComponent}
            </View>
            <View style={GStyles.paddingLeft(pTd(30))}>
              <Text style={GStyles.marginTop(pTd(4))}>
                <TextS>
                  {formatAmountShow(
                    divDecimals(currentTokenInfo?.balance, currentTokenInfo?.decimals),
                    currentTokenInfo?.decimals,
                  )}
                </TextS>
                <TextS>{` ${currentTokenInfo?.symbol}`}</TextS>
                <TextS>
                  {`  ${convertAmountUSDShow(
                    divDecimals(currentTokenInfo?.balance, currentTokenInfo?.decimals),
                    currentTokenInfo?.price,
                  )}`}
                </TextS>
              </Text>
              {!!fee.error && <TextS style={GStyles.marginTop(pTd(4))}>Insufficient balance</TextS>}
              {!!(crossSufficientItem && fee.error) && (
                <TextS style={[FontStyles.font6, GStyles.marginTop(pTd(4))]}>
                  {`You can transfer some ${tokenInfo.symbol} from your ${
                    currentTokenInfo?.chainId === MAIN_CHAIN_ID ? 'SideChain' : 'MainChain'
                  } address`}
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

export const showRedPacket = (props: Omit<PaymentOverlayProps, 'onConfirm' | 'title'>) => {
  return show({ ...props, title: 'Portkey Red Packet' });
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
    paddingVertical: pTd(14),
    paddingHorizontal: pTd(12),
    marginTop: pTd(8),
    borderRadius: pTd(6),
  },
  opacity: {
    opacity: 0.6,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    fontSize: pTd(14),
    marginRight: pTd(8),
  },
});
