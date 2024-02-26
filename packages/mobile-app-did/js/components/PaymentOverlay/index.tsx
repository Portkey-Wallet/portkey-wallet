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
import LottieLoading from 'components/LottieLoading';
import GStyles from 'assets/theme/GStyles';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { convertAmountUSDShow, divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TextS } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import CommonAvatar from 'components/CommonAvatar';
import { formatChainInfoToShow, handleErrorMessage } from '@portkey-wallet/utils';
import { useCurrentCaInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Touchable from 'components/Touchable';
import { BGStyles } from 'assets/theme/styles';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import navigationService, { NavigateName } from 'utils/navigationService';
import { addressFormat } from '@portkey-wallet/utils';
import RedPacketAmountShow from 'pages/Chat/components/RedPacketAmountShow';
import { useDefaultTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useCurrentChannel } from 'pages/Chat/context/hooks';
import { USER_CANCELED } from '@portkey-wallet/constants/errorMessage';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { InsufficientTransactionFee } from 'hooks/useCalculateRedPacketFee';
import { useAppRampEntryShow } from 'hooks/ramp';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';

export type PaymentTokenInfo = {
  symbol: string;
  decimals: number | string;
  imageUrl?: string;
  assetType?: AssetType;
};

export type PaymentOverlayProps = {
  tokenInfo: PaymentTokenInfo;
  chainId: ChainId;
  amount: string;
  title: string;
  calculateTransactionFee: () => Promise<number | string>;
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
  const [, , getTokensPrice] = useGetCurrentAccountTokenPrice();

  const getAccountTokenList = useGetAccountTokenList();
  const allTokenInfoList = useGetAllTokenInfoList();

  const defaultToken = useDefaultToken();

  const defaultTokenPrice = useDefaultTokenPrice();
  const { currentNetwork } = useWallet();
  const { currentChannelType } = useCurrentChannel() || {};
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

  const { isBuySectionShow } = useAppRampEntryShow();
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
    return calculateTransactionFee();
  }, [calculateTransactionFee]);

  const isInsufficientTransactionFee = useMemo(
    () => fee?.error && handleErrorMessage(fee?.error) === InsufficientTransactionFee,
    [fee?.error],
  );

  const calcFeeError = useMemo(
    () => fee?.error && handleErrorMessage(fee?.error) !== InsufficientTransactionFee,
    [fee?.error],
  );

  const feeComponent = useMemo(() => {
    if (isInsufficientTransactionFee) return;
    return (
      <View style={[GStyles.width100, GStyles.marginTop(pTd(16))]}>
        {calcFeeError ? (
          <TextS style={FontStyles.font12}>Failed to send crypto box. Please try again.</TextS>
        ) : (
          <>
            <View style={[GStyles.flexRow, GStyles.spaceBetween]}>
              <TextM>Estimated Transaction Fee</TextM>
              <View>
                <View style={[GStyles.flexRow, GStyles.itemCenter]}>
                  {fee?.loading ? (
                    <LottieLoading lottieWrapStyle={styles.lottieWrapStyle} lottieStyle={styles.lottieStyle} />
                  ) : (
                    <TextM>
                      {formatAmountShow(divDecimals(fee.value, defaultToken.decimals), defaultToken.decimals)}
                    </TextM>
                  )}
                  <TextM>{` ${defaultToken.symbol}`}</TextM>
                </View>
              </View>
            </View>
            <View style={GStyles.alignEnd}>
              {!!defaultTokenPrice && (
                <TextS style={FontStyles.font3}>
                  {convertAmountUSDShow(divDecimals(fee.value, defaultToken.decimals), defaultTokenPrice)}
                </TextS>
              )}
            </View>
          </>
        )}
      </View>
    );
  }, [
    calcFeeError,
    defaultToken.decimals,
    defaultToken.symbol,
    defaultTokenPrice,
    fee?.loading,
    fee.value,
    isInsufficientTransactionFee,
  ]);

  const getButtonComponent = useMemo(() => {
    if (!fee.error) return;

    let buttonTitle = '',
      onPress;
    const successNavigateName: NavigateName = currentChannelType === 'P2P' ? 'ChatDetailsPage' : 'ChatGroupDetailsPage';
    if (crossSufficientItem) {
      buttonTitle = 'Transfer ELF';
      onPress = async () => {
        OverlayModal.hide(false);
        navigationService.navigateByMultiLevelParams('SendHome', {
          params: {
            assetInfo: crossSufficientItem,
            toInfo: {
              address: addressFormat(currentCaAddress, chainId),
            },
          },
          multiLevelParams: {
            successNavigateName,
          },
        });
      };
    } else if (isCanBuy) {
      buttonTitle = 'Buy ELF';
      onPress = () => {
        OverlayModal.hide(false);
        navigationService.navigateByMultiLevelParams('RampHome', {
          params: {
            symbol: tokenInfo.symbol,
          },
          multiLevelParams: {
            successNavigateName,
          },
        });
      };
    }
    if (!buttonTitle) return;
    return (
      <Touchable onPress={onPress} style={styles.getButtonRow}>
        <TextS style={FontStyles.font11}>{buttonTitle}</TextS>
      </Touchable>
    );
  }, [chainId, crossSufficientItem, currentCaAddress, currentChannelType, fee.error, isCanBuy, tokenInfo.symbol]);

  const disableStyle = useMemo(() => !!isInsufficientTransactionFee && styles.opacity, [isInsufficientTransactionFee]);
  const tokenRowComponent = useMemo(() => {
    return (
      <View style={[GStyles.flex1, GStyles.flexRow, styles.rowCenter, disableStyle]}>
        <CommonAvatar
          hasBorder
          style={styles.avatar}
          title={currentTokenInfo?.symbol}
          avatarSize={pTd(24)}
          imageUrl={currentTokenInfo?.imageUrl}
        />
        <TextL style={[GStyles.flex1, GStyles.paddingRight(8), FontStyles.font5]} numberOfLines={1}>
          {tokenInfo.symbol} ({formatChainInfoToShow(chainId, currentNetwork)})
        </TextL>
      </View>
    );
  }, [chainId, currentNetwork, currentTokenInfo?.imageUrl, currentTokenInfo?.symbol, disableStyle, tokenInfo.symbol]);

  const tokenBalanceComponent = useMemo(() => {
    if (isInsufficientTransactionFee) return;

    // TODO: nft
    if (tokenInfo.assetType === AssetType.nft)
      return (
        <Text style={styles.marginTop4}>
          <TextS style={FontStyles.font3}>
            {formatAmountShow(
              divDecimals(currentTokenInfo?.balance, currentTokenInfo?.decimals),
              currentTokenInfo?.decimals,
            )}
          </TextS>
        </Text>
      );

    return (
      <Text style={styles.marginTop4}>
        <TextS style={FontStyles.font3}>
          {formatAmountShow(
            divDecimals(currentTokenInfo?.balance, currentTokenInfo?.decimals),
            currentTokenInfo?.decimals,
          )}
        </TextS>
        <TextS style={FontStyles.font3}>{` ${currentTokenInfo?.symbol}`}</TextS>
        {!!currentTokenInfo?.price && (
          <TextS style={FontStyles.font3}>
            {`  ${convertAmountUSDShow(
              divDecimals(currentTokenInfo?.balance, currentTokenInfo?.decimals),
              currentTokenInfo?.price,
            )}`}
          </TextS>
        )}
      </Text>
    );
  }, [
    currentTokenInfo?.balance,
    currentTokenInfo?.decimals,
    currentTokenInfo?.price,
    currentTokenInfo?.symbol,
    isInsufficientTransactionFee,
    tokenInfo.assetType,
  ]);

  useEffectOnce(() => {
    getTokensPrice([tokenInfo.symbol, defaultToken.symbol]);
  });

  return (
    <ModalBody modalBodyType="bottom">
      <View style={styles.containerStyle}>
        <View style={[GStyles.itemCenter, GStyles.flex1]}>
          <TextM style={styles.titleStyle}> {title}</TextM>
          <RedPacketAmountShow
            // TODO: fix this
            isNFT
            componentType="sendPacketPage"
            textColor={defaultColors.font5}
            amountShow={amount}
            symbol={tokenInfo.symbol}
          />
          {!!currentTokenInfo?.price && (
            <TextM style={GStyles.marginTop(pTd(2))}>{convertAmountUSDShow(amount, currentTokenInfo?.price)}</TextM>
          )}

          {/* TODO: change  */}
          <View style={GStyles.marginTop(pTd(2))}>
            <CommonAvatar shapeType="square" avatarSize={pTd(24)} />
            <TextM numberOfLines={1} style={GStyles.marginLeft(pTd(8))}>{`${'alias'} #${'amount'}`}</TextM>
          </View>

          <View style={[GStyles.marginTop(pTd(40)), GStyles.width100]}>
            <TextS style={styles.balanceLabelStyle}>Balance</TextS>
            <View style={styles.balanceItemRow}>
              <View style={styles.rowCenter}>
                {tokenRowComponent}
                {getButtonComponent}
              </View>

              <View style={[GStyles.paddingLeft(pTd(30))]}>
                {tokenBalanceComponent}
                {!!isInsufficientTransactionFee && (
                  <TextS style={[styles.marginTop4, disableStyle]}>Insufficient balance</TextS>
                )}
                {!!(crossSufficientItem && fee.error) && (
                  <TextS style={[FontStyles.font6, styles.marginTop4]}>
                    {`You can transfer some ${tokenInfo.symbol} from your ${formatChainInfoToShow(
                      crossSufficientItem?.chainId,
                      currentNetwork,
                    )} address`}
                  </TextS>
                )}
              </View>
            </View>
          </View>
          {feeComponent}
        </View>

        <CommonButton
          onPress={() => {
            onConfirm(true);
            OverlayModal.hide(false);
          }}
          disabled={!!(fee.loading || fee.error)}
          loading={fee.loading}
          type="primary">
          Confirm
        </CommonButton>
      </View>
    </ModalBody>
  );
};

export const show = (props: Omit<PaymentOverlayProps, 'onConfirm'>) => {
  return new Promise((resolve, reject) => {
    OverlayModal.show(<PaymentModal {...props} onConfirm={resolve} />, {
      position: 'bottom',
      onDisappearCompleted: () => reject(new Error(USER_CANCELED)),
    });
  });
};

export const showRedPacket = (props: Omit<PaymentOverlayProps, 'onConfirm' | 'title'>) => {
  return show({ ...props, title: 'Portkey Crypto Box' });
};

export default {
  show,
  showRedPacket,
};

export const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: pTd(16),
    paddingBottom: pTd(16),
    paddingHorizontal: pTd(20),
    flex: 1,
  },
  titleStyle: {
    color: defaultColors.font5,
    marginBottom: pTd(12),
  },
  balanceLabelStyle: {
    color: defaultColors.font3,
    marginLeft: pTd(8),
  },
  lottieStyle: {
    width: pTd(15),
    height: pTd(15),
  },
  lottieWrapStyle: { paddingRight: 10, paddingTop: 0 },
  getButtonRow: {
    ...BGStyles.bg5,
    paddingHorizontal: pTd(8),
    paddingVertical: pTd(4),
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
  marginTop4: {
    marginTop: pTd(4),
  },
});
