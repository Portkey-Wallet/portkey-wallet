import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM, TextS, TextL } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import ActionSheet from 'components/ActionSheet';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr, handleErrorMessage } from '@portkey-wallet/utils';
import { isCrossChain } from '@portkey-wallet/utils/aelf';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { usePin } from 'hooks/store';
import { useCaAddressInfoList, useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getManagerAccount } from 'utils/redux';
import crossChainTransfer, {
  CrossChainTransferIntervalParams,
  intervalCrossChainTransfer,
} from 'utils/transfer/crossChainTransfer';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { formatAmountShow, formatAmountUSDShow, timesDecimals, unitConverter } from '@portkey-wallet/utils/converter';
import sameChainTransfer from 'utils/transfer/sameChainTransfer';
import { addFailedActivity, removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { useRouterEffectParams } from '@portkey-wallet/hooks/useRouterParams';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';
import Loading from 'components/Loading';
import { IToSendPreviewParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { ZERO } from '@portkey-wallet/constants/misc';
import { sleep } from '@portkey-wallet/utils';
import { FontStyles } from 'assets/theme/styles';
import { ChainId } from '@portkey-wallet/types';
import {
  useAmountInUsdShow,
  useGetCurrentAccountTokenPrice,
  useIsTokenHasPrice,
} from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import useEffectOnce from 'hooks/useEffectOnce';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useCheckTransferLimitWithJump } from 'hooks/security';
import { useSendIMTransfer } from '@portkey-wallet/hooks/hooks-ca/im/transfer';
import {
  CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL,
  useCrossTransferByEtransfer,
} from '@portkey-wallet/hooks/hooks-ca/useWithdrawByETransfer';
import { TransferTypeEnum } from '@portkey-wallet/im';
import { useJumpToChatDetails, useJumpToChatGroupDetails } from 'hooks/chat';
import { useFocusEffect } from '@react-navigation/native';
import NFTAvatar from 'components/NFTAvatar';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { useAccountNFTCollectionInfo, useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import {
  PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
  PAGE_SIZE_IN_ACCOUNT_TOKEN,
} from '@portkey-wallet/constants/constants-ca/assets';

const SendPreview: React.FC = () => {
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();
  const defaultToken = useDefaultToken();

  const routerParams = useRouterEffectParams<IToSendPreviewParamsType>();
  const {
    sendType,
    assetInfo,
    toInfo,
    transactionFee,
    sendNumber,
    successNavigateName,
    guardiansApproved,
    isAutoSend = false,
    imTransferInfo,
    receiveAmount,
    receiveAmountUsd,
    isEtransferCrossInLimit = false,
    crossChainFee,
    crossChainFeeUnit,
  } = routerParams;

  const isApproved = useMemo(() => guardiansApproved && guardiansApproved.length > 0, [guardiansApproved]);

  useFetchTxFee();
  const { crossChain: crossDefaultFee } = useGetTxFee(assetInfo.chainId);
  const amountInUsdShow = useAmountInUsdShow();

  const dispatch = useAppCommonDispatch();
  const pin = usePin();
  const chainInfo = useCurrentChain(assetInfo.chainId);

  const { fetchAccountNFTCollectionInfoList } = useAccountNFTCollectionInfo();
  const { fetchAccountTokenInfoList } = useAccountTokenInfo();

  const sendIMTransfer = useSendIMTransfer();
  const jumpToChatDetails = useJumpToChatDetails();
  const jumpToChatGroupDetails = useJumpToChatGroupDetails();

  const [isLoading] = useState(false);
  const currentNetwork = useCurrentNetworkInfo();
  const caAddressInfos = useCaAddressInfoList();
  const wallet = useCurrentWalletInfo();
  const userInfo = useCurrentUserInfo();
  const contractRef = useRef<ContractBasic>();
  const tokenContractRef = useRef<ContractBasic>();
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const isTokenHasPrice = useIsTokenHasPrice(assetInfo.symbol);

  const crossTransferByEtransfer = useCrossTransferByEtransfer(pin);
  const isSupportEtransferCross = useMemo(
    () => CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(assetInfo.symbol) && isEtransferCrossInLimit,
    [assetInfo.symbol, isEtransferCrossInLimit],
  );

  const isCrossChainTransfer = isCrossChain(toInfo.address, assetInfo.chainId);
  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();

  const amount = useMemo(
    () => timesDecimals(sendNumber, assetInfo.decimals).toFixed(),
    [assetInfo.decimals, sendNumber],
  );

  const EstimateAmount = useMemo(() => {
    if (ZERO.plus(amount).isLessThanOrEqualTo(crossChainFee || '') && assetInfo.symbol === defaultToken.symbol)
      return {
        estimateAmount: `0 ${assetInfo?.label || assetInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? '$ 0' : '',
      };

    let _amount = amount;
    let amountUsd;
    if (receiveAmount) _amount = receiveAmount;
    else _amount = formatAmountShow(ZERO.plus(_amount).minus(crossChainFee || ''), Number(defaultToken.decimals));

    if (receiveAmountUsd) amountUsd = formatAmountUSDShow(receiveAmountUsd);
    else
      amountUsd = amountInUsdShow(
        ZERO.plus(_amount)
          .minus(crossChainFee || '')
          .toFixed(),
        0,
        assetInfo.symbol,
      );

    return {
      estimateAmount: `${_amount} ${assetInfo.label || assetInfo.symbol}`,
      estimateAmountUsd: isMainnet ? amountUsd : '',
    };
  }, [
    amount,
    amountInUsdShow,
    assetInfo.label,
    assetInfo.symbol,
    crossChainFee,
    defaultToken.decimals,
    defaultToken.symbol,
    isMainnet,
    receiveAmount,
    receiveAmountUsd,
  ]);

  const showRetry = useCallback(
    (retryFunc: () => void) => {
      ActionSheet.alert({
        title: t('Transaction failed !'),
        buttons: [
          {
            title: t('Resend'),
            type: 'solid',
            onPress: () => {
              retryFunc();
            },
          },
        ],
      });
    },
    [t],
  );

  const transfer = useCallback(async () => {
    const tokenInfo = {
      symbol: assetInfo.symbol,
      decimals: assetInfo.decimals ?? 0,
      address: assetInfo.tokenContractAddress,
    };

    if (!chainInfo || !pin) return;
    const account = getManagerAccount(pin);
    if (!account) return;

    if (!contractRef.current) {
      contractRef.current = await getContractBasic({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo.endPoint,
        account,
      });
    }

    const contract = contractRef.current;

    if (!isApproved) {
      const checkTransferLimitResult = await checkTransferLimitWithJump({
        caContract: contract,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        amount: String(sendNumber),
        chainId: chainInfo.chainId,
        approveMultiLevelParams: {
          successNavigate: {
            name: 'SendPreview',
            params: {
              ...routerParams,
              isAutoSend: true,
            },
          },
        },
      });
      if (!checkTransferLimitResult) return;
    }

    if (isCrossChainTransfer) {
      if (!tokenContractRef.current) {
        tokenContractRef.current = await getContractBasic({
          contractAddress: tokenInfo.address,
          rpcUrl: chainInfo.endPoint,
          account,
        });
      }
      const tokenContract = tokenContractRef.current;

      if (isSupportEtransferCross) {
        const crossTransferByEtransferResult = await crossTransferByEtransfer.withdraw({
          chainId: chainInfo.chainId,
          tokenContract,
          portkeyContract: contract,
          toAddress: toInfo.address,
          amount: String(sendNumber),
          tokenInfo: {
            symbol: assetInfo.symbol,
            decimals: Number(assetInfo.decimals),
            address: assetInfo.tokenContractAddress,
          },
        });
        console.log('crossTransferByEtransferResult', crossTransferByEtransferResult);
      } else {
        const crossChainTransferResult = await crossChainTransfer({
          tokenContract,
          contract,
          chainType: currentNetwork.walletType ?? 'aelf',
          managerAddress: wallet.address,
          tokenInfo: { ...assetInfo, address: assetInfo.tokenContractAddress } as unknown as BaseToken,
          caHash: wallet.caHash || '',
          amount,
          crossDefaultFee,
          toAddress: toInfo.address,
          guardiansApproved,
        });

        console.log('crossChainTransferResult', crossChainTransferResult);
      }
    } else {
      console.log('sameChainTransfers==sendHandler', tokenInfo);
      const sameTransferResult = await sameChainTransfer({
        contract,
        tokenInfo: {
          ...assetInfo,
          address: assetInfo?.tokenContractAddress || assetInfo?.address,
        } as unknown as BaseToken,
        caHash: wallet.caHash || '',
        amount,
        toAddress: toInfo.address,
        guardiansApproved,
      });

      if (sameTransferResult.error) {
        return CommonToast.fail(sameTransferResult?.error?.message || '');
      }
      console.log('sameTransferResult', sameTransferResult);
    }

    await sleep(1500);

    if (sendType === 'nft') {
      fetchAccountNFTCollectionInfoList({
        caAddressInfos,
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
      });
    } else {
      fetchAccountTokenInfoList({
        caAddressInfos,
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      });
    }
    if (successNavigateName) {
      navigationService.navigate(successNavigateName);
    } else {
      navigationService.navigate('Tab', { clearType: sendType + Math.random() });
    }
    CommonToast.success('success');
  }, [
    amount,
    assetInfo,
    caAddressInfos,
    chainInfo,
    checkTransferLimitWithJump,
    crossDefaultFee,
    crossTransferByEtransfer,
    currentNetwork.walletType,
    fetchAccountNFTCollectionInfoList,
    fetchAccountTokenInfoList,
    guardiansApproved,
    isApproved,
    isCrossChainTransfer,
    isSupportEtransferCross,
    pin,
    routerParams,
    sendNumber,
    sendType,
    successNavigateName,
    toInfo.address,
    wallet.address,
    wallet.caHash,
  ]);

  const retryCrossChain = useCallback(
    async (managerTransferTxId: string, data: CrossChainTransferIntervalParams) => {
      const tokenInfo = {
        symbol: assetInfo.symbol,
        decimals: assetInfo.decimals ?? 0,
        address: assetInfo.tokenContractAddress,
      };
      if (!chainInfo || !pin) return;
      const account = getManagerAccount(pin);
      if (!account) return;

      Loading.show();
      try {
        if (!tokenContractRef.current) {
          tokenContractRef.current = await getContractBasic({
            contractAddress: tokenInfo.address,
            rpcUrl: chainInfo.endPoint,
            account,
          });
        }
        const tokenContract = tokenContractRef.current;
        await intervalCrossChainTransfer(tokenContract, data);
        dispatch(removeFailedActivity(managerTransferTxId));
        navigationService.navigate('Tab');
        CommonToast.success('success');
      } catch (error) {
        showRetry(() => {
          retryCrossChain(managerTransferTxId, data);
        });
      } finally {
        Loading.hide();
      }
    },
    [assetInfo.decimals, assetInfo.symbol, assetInfo.tokenContractAddress, chainInfo, dispatch, pin, showRetry],
  );

  const imSend = useCallback(async () => {
    if (!chainInfo || !pin) return;
    const account = getManagerAccount(pin);
    if (!account) return;

    if (!contractRef.current) {
      contractRef.current = await getContractBasic({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo.endPoint,
        account,
      });
    }

    if (!contractRef.current || !imTransferInfo?.channelId || !imTransferInfo?.toUserId) return;
    Loading.show();
    try {
      const params = {
        channelId: imTransferInfo?.channelId || '',
        toUserId: imTransferInfo?.toUserId || '',
        chainId: assetInfo.chainId,
        symbol: assetInfo.symbol,
        amount,
        image: '',
        memo: '',
        type: imTransferInfo.isGroupChat ? TransferTypeEnum.GROUP : TransferTypeEnum.P2P,
        caContract: contractRef.current,
        tokenContractAddress: assetInfo.tokenContractAddress,
        toCAAddress: toInfo.address,
        guardiansApproved,
      };

      await sendIMTransfer(params);
      CommonToast.success('Successfully sent');
    } catch (error: any) {
      const errorMessage = handleErrorMessage(error);
      if (errorMessage === 'fetch exceed limit') {
        CommonToast.warn('You can view the transfer later in the chat window.');
      } else {
        CommonToast.failError('Transferred failed');
      }
      console.log('IM send error', error);
    } finally {
      if (imTransferInfo.isGroupChat) {
        await jumpToChatGroupDetails({ channelUuid: imTransferInfo.channelId });
      } else {
        await jumpToChatDetails({ channelUuid: imTransferInfo.channelId });
      }
      Loading.hide();
    }
  }, [
    amount,
    assetInfo.chainId,
    assetInfo.symbol,
    assetInfo.tokenContractAddress,
    chainInfo,
    guardiansApproved,
    imTransferInfo?.channelId,
    imTransferInfo?.isGroupChat,
    imTransferInfo?.toUserId,
    jumpToChatDetails,
    jumpToChatGroupDetails,
    pin,
    sendIMTransfer,
    toInfo.address,
  ]);

  const GeneralSend = useCallback(async () => {
    Loading.show();
    try {
      await transfer();
    } catch (error: any) {
      console.log('sendHandler: error', error);
      if (error.type === 'managerTransfer') {
        console.log(error);
        CommonToast.failError(error.error);
        return;
      } else if (error.type === 'crossChainTransfer') {
        dispatch(
          addFailedActivity({
            transactionId: error.managerTransferTxId,
            params: error.data,
          }),
        );
        showRetry(() => {
          retryCrossChain(error.managerTransferTxId, error.data);
        });
        return;
      } else {
        CommonToast.failError(error);
      }
    }
    Loading.hide();
  }, [dispatch, retryCrossChain, showRetry, transfer]);

  const checkAndSend = useCallback(() => {
    if (assetInfo.chainId !== DefaultChainId)
      return ActionSheet.alert({
        title: t('Send to exchange account?'),
        message: t(
          `Please note that assets on the SideChain can't be sent directly to exchanges. You can transfer your SideChain assets to the MainChain before sending them to your exchange account.`,
        ),
        buttons: [
          {
            type: 'outline',
            title: 'Cancel',
          },
          {
            title: t('Confirm'),
            type: 'primary',
            onPress: GeneralSend,
          },
        ],
      });
    GeneralSend();
  }, [GeneralSend, assetInfo.chainId, t]);
  const onSend = useCallback(() => {
    imTransferInfo ? imSend() : checkAndSend();
  }, [checkAndSend, imSend, imTransferInfo]);

  useFocusEffect(
    useCallback(() => {
      if (!isAutoSend) return;
      onSend();
    }, [isAutoSend, onSend]),
  );

  const networkInfoShow = (address: string) => {
    const chainId = address.split('_')[2] as ChainId;
    return formatChainInfoToShow(chainId);
  };

  useEffectOnce(() => {
    getTokenPrice(assetInfo.symbol);
    getTokenPrice(defaultToken.symbol);
  });

  return (
    <PageContainer
      safeAreaColor={['white', 'white']}
      titleDom={`${t('Send')}${sendType === 'token' ? ' ' + (assetInfo?.label || assetInfo?.symbol) : ''}`}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {sendType === 'nft' ? (
        <View style={styles.topWrap}>
          {
            <NFTAvatar
              disabled
              isSeed={assetInfo.isSeed}
              seedType={assetInfo.seedType}
              nftSize={pTd(64)}
              badgeSizeType="normal"
              data={{
                imageUrl: assetInfo.imageUrl,
                alias: assetInfo.alias,
              }}
              style={styles.img}
            />
          }
          <View style={styles.topLeft}>
            <TextL numberOfLines={1} style={[styles.nftTitle, fonts.mediumFont]}>
              {`${assetInfo.alias} #${assetInfo?.tokenId}  `}
            </TextL>
            <TextS style={[FontStyles.font3]}>{`Amount: ${formatAmountShow(sendNumber, assetInfo.decimals)}`}</TextS>
          </View>
        </View>
      ) : (
        <>
          <Text style={[styles.tokenCount, FontStyles.font5, fonts.mediumFont]}>
            {`- ${formatAmountShow(sendNumber, assetInfo.decimals)} ${assetInfo.label || assetInfo?.symbol}`}
          </Text>
          {isMainnet && isTokenHasPrice && (
            <TextM style={styles.tokenUSD}>{`- ${formatAmountUSDShow(
              ZERO.plus(sendNumber).multipliedBy(tokenPriceObject[assetInfo.symbol]),
            )}`}</TextM>
          )}
        </>
      )}
      <ScrollView>
        <View style={styles.card}>
          {/* From */}
          <View style={styles.section}>
            <View style={[styles.flexSpaceBetween]}>
              <TextM style={styles.lightGrayFontColor}>{t('From')}</TextM>
              <TextM style={styles.blackFontColor}>{userInfo?.nickName}</TextM>
            </View>
            <View style={[styles.flexSpaceBetween]}>
              <TextM style={styles.lightGrayFontColor} />
              <TextS style={styles.lightGrayFontColor}>
                {formatStr2EllipsisStr(addressFormat(wallet?.[assetInfo?.chainId]?.caAddress, assetInfo.chainId))}
              </TextS>
            </View>
          </View>
          <Text style={[styles.divider, styles.marginTop0]} />
          {/* To */}
          <View style={styles.section}>
            <View style={[styles.flexSpaceBetween]}>
              <TextM style={[styles.lightGrayFontColor]}>{t('To')}</TextM>
              <View style={styles.alignItemsEnd}>
                {toInfo?.name && <TextM style={[styles.blackFontColor]}>{toInfo?.name}</TextM>}
                <TextS style={styles.lightGrayFontColor}>{formatStr2EllipsisStr(toInfo?.address)}</TextS>
              </View>
            </View>
          </View>
          <Text style={[styles.divider, styles.marginTop0]} />
          {/* more Info */}
          <View style={styles.section}>
            <View style={[styles.flexSpaceBetween]}>
              <TextM style={[styles.lightGrayFontColor]}>{t('Network')}</TextM>
              <TextM style={[styles.blackFontColor, GStyles.alignEnd]}>
                {formatChainInfoToShow(assetInfo.chainId)}
              </TextM>
            </View>
            <View style={[styles.flexSpaceBetween]}>
              <TextM style={styles.blackFontColor} />
              <TextM style={[styles.blackFontColor, GStyles.alignEnd]}>{`→${networkInfoShow(toInfo?.address)}`}</TextM>
            </View>
          </View>

          <Text style={[styles.divider, styles.marginTop0]} />
          {/* transaction Fee */}
          <View style={styles.section}>
            <View style={[styles.flexSpaceBetween]}>
              <TextM style={[styles.blackFontColor, styles.fontBold]}>{t('Transaction Fee')}</TextM>
              <TextM
                style={[styles.blackFontColor, styles.fontBold]}>{`${transactionFee} ${defaultToken.symbol}`}</TextM>
            </View>
            {isMainnet && (
              <View>
                <TextM />
                <TextS style={[styles.blackFontColor, styles.lightGrayFontColor, GStyles.alignEnd]}>{`$ ${unitConverter(
                  ZERO.plus(transactionFee).multipliedBy(tokenPriceObject[defaultToken.symbol]),
                )}`}</TextS>
              </View>
            )}
          </View>

          {isCrossChainTransfer && (
            <>
              <Text style={[styles.divider, styles.marginTop0]} />
              <View style={styles.section}>
                <View style={[styles.flexSpaceBetween]}>
                  <TextM style={[styles.blackFontColor, styles.fontBold, styles.leftEstimatedTitle]}>
                    {t('Estimated CrossChain Transfer')}
                  </TextM>
                  <View>
                    <TextM style={[styles.blackFontColor, styles.fontBold, GStyles.alignEnd]}>
                      {isSupportEtransferCross
                        ? `${crossChainFee} ${crossChainFeeUnit}`
                        : `${unitConverter(crossDefaultFee)} ${defaultToken.symbol}`}
                    </TextM>
                    {isMainnet ? (
                      <TextS
                        style={[
                          styles.blackFontColor,
                          styles.lightGrayFontColor,
                          GStyles.alignEnd,
                        ]}>{`$ ${unitConverter(
                        ZERO.plus(crossDefaultFee).multipliedBy(tokenPriceObject[defaultToken.symbol]),
                      )}`}</TextS>
                    ) : (
                      <TextM />
                    )}
                  </View>
                </View>
              </View>
              <Text style={[styles.divider, styles.marginTop0]} />
            </>
          )}
          {isCrossChainTransfer && (isSupportEtransferCross || assetInfo.symbol === defaultToken.symbol) && (
            <View style={styles.section}>
              <View style={[styles.flexSpaceBetween]}>
                <TextM style={[styles.blackFontColor, styles.fontBold, styles.leftTitle, GStyles.alignEnd]}>
                  {t('Estimated amount received')}
                </TextM>
                <View>
                  <TextM style={[styles.blackFontColor, styles.fontBold, GStyles.alignEnd]}>
                    {EstimateAmount.estimateAmount}
                  </TextM>
                  {isMainnet ? (
                    <TextS style={[styles.blackFontColor, styles.lightGrayFontColor, GStyles.alignEnd]}>
                      {EstimateAmount.estimateAmountUsd}
                    </TextS>
                  ) : (
                    <TextM />
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonWrapStyle}>
        <CommonButton loading={isLoading} title={t('Send')} type="primary" onPress={onSend} />
      </View>
    </PageContainer>
  );
};

export default memo(SendPreview);

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg1,
    flex: 1,
  },
  topWrap: {
    width: '100%',
    marginTop: pTd(40),
    ...GStyles.flexRowWrap,
  },
  img: {
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    marginRight: pTd(16),
  },
  noImg: {
    overflow: 'hidden',
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg7,
    fontSize: pTd(54),
    lineHeight: pTd(64),
    textAlign: 'center',
    color: defaultColors.font7,
    marginRight: pTd(16),
  },
  topLeft: {
    ...GStyles.flexCol,
    justifyContent: 'center',
  },
  nftTitle: {
    color: defaultColors.font5,
    marginBottom: pTd(4),
    paddingRight: pTd(8),
    maxWidth: pTd(230),
  },
  tokenCount: {
    marginTop: pTd(40),
    fontSize: pTd(28),
    width: '100%',
    textAlign: 'center',
  },
  tokenUSD: {
    color: defaultColors.font3,
    width: '100%',
    textAlign: 'center',
    marginTop: pTd(4),
  },
  group: {
    backgroundColor: defaultColors.bg1,
    marginTop: pTd(24),
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    borderRadius: pTd(6),
  },
  buttonWrapStyle: {
    justifyContent: 'flex-end',
    paddingBottom: pTd(12),
    paddingTop: pTd(12),
  },
  errorMessage: {
    lineHeight: pTd(16),
    color: defaultColors.error,
    marginTop: pTd(4),
    paddingLeft: pTd(8),
  },
  wrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderTop: {
    borderTopColor: defaultColors.border6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
    color: defaultColors.font3,
  },
  tokenNum: {
    textAlign: 'right',
    color: defaultColors.font5,
  },
  usdtNum: {
    marginLeft: pTd(6),
    marginTop: pTd(4),
    color: defaultColors.font3,
    textAlign: 'right',
  },
  notELFWrap: {
    height: pTd(84),
    alignItems: 'flex-start',
    paddingTop: pTd(18),
    paddingBottom: pTd(18),
  },
  totalWithUSD: {
    marginTop: pTd(12),
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    lineHeight: pTd(20),
  },
  titles1: {
    marginTop: pTd(56),
  },
  values1: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(24),
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.border6,
  },
  titles2: {
    marginTop: pTd(25),
  },
  values2: {
    marginTop: pTd(4),
  },
  card: {
    marginTop: pTd(40),
    borderRadius: pTd(6),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
    width: '100%',
  },
  section: {
    ...GStyles.paddingArg(16, 12),
  },
  marginTop16: {
    marginTop: pTd(16),
  },
  marginTop4: {
    marginTop: pTd(4),
  },
  marginTop0: {
    marginTop: 0,
  },
  marginLeft8: {
    marginLeft: pTd(8),
  },
  space: {
    flex: 1,
  },
  button: {
    marginBottom: pTd(30),
  },
  lightGrayFontColor: {
    color: defaultColors.font3,
  },
  blackFontColor: {
    color: defaultColors.font5,
  },
  fontBold: {
    ...fonts.mediumFont,
  },
  greenFontColor: {
    color: defaultColors.font10,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  leftTitle: {
    width: pTd(120),
    lineHeight: pTd(20),
  },
  leftEstimatedTitle: {
    width: pTd(180),
  },
});
