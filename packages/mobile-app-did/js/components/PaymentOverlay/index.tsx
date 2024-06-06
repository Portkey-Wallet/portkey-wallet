import React, { useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View, Text } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import { pTd } from 'utils/unit';
import { ChainId } from '@portkey-wallet/types';
import { useAccountCryptoBoxAssetList } from '@portkey-wallet/hooks/hooks-ca/balances';
import { TextL, TextM } from 'components/CommonText';
import { useGetAccountTokenList, useGetAllTokenInfoList } from 'hooks/account';
import { useEffectOnce } from '@portkey-wallet/hooks';
import merge from 'lodash/merge';
import { useAsync } from 'react-use';
import LottieLoading from 'components/LottieLoading';
import GStyles from 'assets/theme/GStyles';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { convertAmountUSDShow, divDecimals, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { IAccountCryptoBoxAssetItem } from '@portkey-wallet/types/types-ca/token';
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
import NFTAvatar from 'components/NFTAvatar';

export type PaymentAssetInfo = {
  symbol: string;
  label?: string;
  decimals: number | string;
  alias?: string;
  tokenId?: string;
  imageUrl?: string;
  assetType?: AssetType;
};

export type PaymentOverlayProps = {
  assetInfo: PaymentAssetInfo;
  chainId: ChainId;
  amount: string;
  title: string;
  calculateTransactionFee: () => Promise<number | string>;
  onConfirm: (value: unknown) => void;
};

const PaymentModal = ({
  assetInfo,
  chainId,
  amount,
  title,
  calculateTransactionFee,
  onConfirm,
}: PaymentOverlayProps) => {
  const accountAssetList = useAccountCryptoBoxAssetList();
  const [tokenPriceObject, , getTokensPrice] = useGetCurrentAccountTokenPrice();

  const getAccountTokenList = useGetAccountTokenList();
  const allTokenInfoList = useGetAllTokenInfoList();

  const defaultToken = useDefaultToken();

  const defaultTokenPrice = useDefaultTokenPrice();
  const { currentNetwork } = useWallet();
  const { currentChannelType } = useCurrentChannel() || {};
  const currentCaInfo = useCurrentCaInfo();
  const currentCaAddress = useMemo(() => currentCaInfo?.[chainId]?.caAddress, [chainId, currentCaInfo]);

  const [assetMap, crossSufficientList] = useMemo(() => {
    const currentSymbolList: IAccountCryptoBoxAssetItem[] = [];
    const crossSufficient: IAccountCryptoBoxAssetItem[] = [];
    const map: { [key: string]: IAccountCryptoBoxAssetItem } = accountAssetList.reduce((acc, item) => {
      if (item?.symbol === assetInfo?.symbol) {
        currentSymbolList.push(item);
        if (item?.chainId !== chainId && divDecimals(item?.balance, item?.decimals).gte(amount))
          crossSufficient.push(item);
        return merge(acc, { [item?.chainId]: item });
      }
      return acc;
    }, {});
    return [map, crossSufficient];
  }, [accountAssetList, amount, assetInfo?.symbol, chainId]);

  const currentNft = useMemo(
    () => accountAssetList.find(ele => ele.symbol === assetInfo.symbol && ele.chainId === chainId),
    [accountAssetList, assetInfo.symbol, chainId],
  );

  const crossSufficientItem = useMemo(() => crossSufficientList[0], [crossSufficientList]);

  const currentAssetInfo: IAccountCryptoBoxAssetItem | undefined = useMemo(() => {
    if (assetMap?.[chainId]) return assetMap?.[chainId];
    return accountAssetList.find(ele => ele.symbol === assetInfo.symbol);
  }, [accountAssetList, assetInfo.symbol, assetMap, chainId]);

  const { isBuySectionShow } = useAppRampEntryShow();
  const isCanBuy = useMemo(
    () => assetInfo.symbol === defaultToken.symbol && isBuySectionShow,
    [assetInfo.symbol, defaultToken.symbol, isBuySectionShow],
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
                    <TextM>{formatTokenAmountShowWithDecimals(fee.value, defaultToken.decimals)}</TextM>
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
      buttonTitle = assetInfo.assetType === AssetType.ft ? 'Transfer Token' : 'Transfer NFT';
      onPress = async () => {
        OverlayModal.hide(false);
        navigationService.navigateByMultiLevelParams('SendHome', {
          params: {
            assetInfo: crossSufficientItem,
            sendType: assetInfo.assetType === AssetType.ft ? 'token' : 'nft',
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
            symbol: assetInfo.symbol,
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
        <TextS style={FontStyles.font2}>{buttonTitle}</TextS>
      </Touchable>
    );
  }, [
    assetInfo.assetType,
    assetInfo.symbol,
    chainId,
    crossSufficientItem,
    currentCaAddress,
    currentChannelType,
    fee.error,
    isCanBuy,
  ]);

  const disableStyle = useMemo(() => !!isInsufficientTransactionFee && styles.opacity, [isInsufficientTransactionFee]);

  const tokenRowComponent = useMemo(() => {
    return (
      <View style={[GStyles.flex1, GStyles.flexRow, styles.rowCenter, disableStyle]}>
        {assetInfo.assetType === AssetType.nft ? (
          <NFTAvatar
            disabled
            style={[GStyles.marginRight(8), styles.nftAvatar]}
            nftSize={pTd(24)}
            data={{
              imageUrl: assetInfo.imageUrl || '',
              alias: assetInfo.alias,
            }}
          />
        ) : (
          <CommonAvatar
            hasBorder
            shapeType={'circular'}
            style={styles.avatar}
            titleStyle={styles.avatarTitle}
            borderStyle={GStyles.hairlineBorder}
            title={assetInfo.symbol}
            avatarSize={pTd(24)}
            imageUrl={assetInfo?.imageUrl}
          />
        )}
        <View
          style={[
            GStyles.flexRow,
            GStyles.itemCenter,
            GStyles.flex1,
            GStyles.paddingRight(8),
            (!!crossSufficientItem || !!isCanBuy) && GStyles.paddingRight(88),
          ]}>
          <TextL
            style={[
              FontStyles.font5,
              !!crossSufficientItem || !!isCanBuy ? GStyles.maxWidth(pTd(80)) : GStyles.maxWidth(pTd(180)),
            ]}
            numberOfLines={1}>
            {`${
              assetInfo.assetType === AssetType.nft
                ? assetInfo.alias + ' #' + assetInfo.tokenId
                : assetInfo.label || assetInfo.symbol
            }`}
          </TextL>
          <TextS style={FontStyles.font5} numberOfLines={1}>
            {' ' + formatChainInfoToShow(chainId, currentNetwork)}
          </TextS>
        </View>
      </View>
    );
  }, [
    assetInfo.alias,
    assetInfo.assetType,
    assetInfo.imageUrl,
    assetInfo.label,
    assetInfo.symbol,
    assetInfo.tokenId,
    chainId,
    crossSufficientItem,
    currentNetwork,
    disableStyle,
    isCanBuy,
  ]);

  const tokenBalanceComponent = useMemo(() => {
    if (isInsufficientTransactionFee) return;

    if (assetInfo.assetType === AssetType.nft)
      return (
        <Text style={styles.marginTop4}>
          <TextS style={FontStyles.font3}>
            {formatTokenAmountShowWithDecimals(currentNft?.balance, currentNft?.decimals)}
          </TextS>
        </Text>
      );

    return (
      <Text style={styles.marginTop4}>
        <TextS style={FontStyles.font3}>
          {formatTokenAmountShowWithDecimals(currentAssetInfo?.balance, currentAssetInfo?.decimals)}
        </TextS>
        <TextS style={FontStyles.font3}>{` ${currentAssetInfo?.label || currentAssetInfo?.symbol || ''}`}</TextS>
        {!!tokenPriceObject[currentAssetInfo?.symbol || ''] && (
          <TextS style={FontStyles.font3}>
            {`  ${convertAmountUSDShow(
              divDecimals(currentAssetInfo?.balance, currentAssetInfo?.decimals),
              tokenPriceObject[currentAssetInfo?.symbol || ''],
            )}`}
          </TextS>
        )}
      </Text>
    );
  }, [
    assetInfo.assetType,
    currentAssetInfo?.balance,
    currentAssetInfo?.decimals,
    currentAssetInfo?.label,
    currentAssetInfo?.symbol,
    currentNft?.balance,
    currentNft?.decimals,
    isInsufficientTransactionFee,
    tokenPriceObject,
  ]);

  useEffectOnce(() => {
    getTokensPrice([assetInfo.symbol, defaultToken.symbol]);
  });

  return (
    <ModalBody modalBodyType="bottom">
      <View style={styles.containerStyle}>
        <View style={[GStyles.itemCenter, GStyles.flex1]}>
          <TextM style={styles.titleStyle}> {title}</TextM>
          <RedPacketAmountShow
            assetType={assetInfo.assetType}
            componentType="sendPacketPage"
            textColor={defaultColors.font5}
            amountShow={amount}
            symbol={assetInfo.assetType === AssetType.nft ? '' : assetInfo.symbol}
            label={assetInfo.label}
          />
          {!!tokenPriceObject[currentAssetInfo?.symbol || ''] && assetInfo.assetType === AssetType.ft && (
            <TextM style={GStyles.marginTop(pTd(2))}>
              {convertAmountUSDShow(amount, tokenPriceObject[currentAssetInfo?.symbol || ''])}
            </TextM>
          )}
          {assetInfo.assetType === AssetType.nft && (
            <View style={[GStyles.flexRow, GStyles.center, GStyles.marginTop(pTd(4))]}>
              <NFTAvatar
                disabled
                nftSize={pTd(24)}
                style={styles.nftAvatar}
                data={{
                  imageUrl: assetInfo.imageUrl || '',
                  alias: assetInfo.alias,
                }}
              />

              <TextM
                numberOfLines={1}
                style={[
                  GStyles.marginLeft(pTd(8)),
                  GStyles.maxWidth(250),
                  FontStyles.font5,
                ]}>{`${assetInfo.alias} #${assetInfo.tokenId}`}</TextM>
            </View>
          )}

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
                    {`You can transfer some ${
                      assetInfo.assetType === AssetType.ft ? assetInfo.symbol : assetInfo.alias
                    } from your ${formatChainInfoToShow(crossSufficientItem?.chainId, currentNetwork)} address`}
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
    marginRight: pTd(8),
  },
  avatarTitle: {
    fontSize: pTd(14),
    color: defaultColors.font11,
  },
  marginTop4: {
    marginTop: pTd(4),
  },
  nftAvatar: {
    borderRadius: pTd(4),
  },
});
