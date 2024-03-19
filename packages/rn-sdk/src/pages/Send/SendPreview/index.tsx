import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM, TextS, TextL } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import ActionSheet from 'components/ActionSheet';
import { ChainId } from '@portkey/provider-types';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { useCheckTransferLimitWithJump } from 'components/WalletSecurityAccelerate/hook';
import { useLanguage } from 'i18n/hooks';
import { ZERO } from '@portkey-wallet/constants/misc';
import { IToSendPreviewParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { BaseToken } from '@portkey-wallet/types/types-eoa/token';
import { sleep, formatChainInfoToShow, formatStr2EllipsisStr, addressFormat } from '@portkey-wallet/utils';
import { isCrossChain } from '@portkey-wallet/utils/aelf';
import { timesDecimals, formatAmountShow, unitConverter } from '@portkey-wallet/utils/converter';
import { ScreenHeight } from '@rneui/base';
import crossChainTransfer, {
  CrossChainTransferIntervalParams,
  intervalCrossChainTransfer,
} from 'utils/transfer/crossChainTransfer';
import sameChainTransfer from 'utils/transfer/sameChainTransfer';
import { useCurrentNetworkType } from 'model/hooks/network';
import { useCommonNetworkInfo } from 'components/TokenOverlay/hooks';
import { useUnlockedWallet } from 'model/wallet';
import { useGetTxFee, useTokenPrices } from 'model/hooks/balance';
import { getContractInstanceOnParticularChain, getTokenContract } from 'model/contract/handler';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { getBottomSpace } from 'utils/screen';

const SendPreview = (props: IToSendPreviewParamsType) => {
  const { navigateTo } = useBaseContainer({ entryName: PortkeyEntries.SEND_TOKEN_CONFIRM_ENTRY });
  const { t } = useLanguage();
  const networkType = useCurrentNetworkType();
  const isTestnet = useMemo(() => networkType !== 'MAINNET', [networkType]);
  const { sendType, assetInfo, toInfo, transactionFee, sendNumber, guardiansApproved, isAutoSend = false } = props;

  const fromChainId = useMemo(() => assetInfo?.chainId || 'AELF', [assetInfo]);

  const { defaultToken } = useCommonNetworkInfo(fromChainId);

  const isApproved = useMemo(() => guardiansApproved && guardiansApproved.length > 0, [guardiansApproved]);

  const tokenList = useMemo(() => [assetInfo.symbol], [assetInfo]);
  const tokenPriceList = useTokenPrices(tokenList);
  const tokenContractAddress = useMemo(() => {
    return assetInfo.tokenContractAddress || assetInfo.address;
  }, [assetInfo]);

  const { txFee } = useGetTxFee(fromChainId);
  const { crossChain: crossDefaultFee } = useMemo(
    () => txFee?.find(it => it.chainId === fromChainId)?.transactionFee || { crossChain: 0 },
    [fromChainId, txFee],
  );
  const { wallet } = useUnlockedWallet();
  const walletName = useMemo(() => wallet?.name, [wallet]);

  const tokenPrice = useMemo(
    () => tokenPriceList.tokenPrices.find(it => it.symbol === assetInfo.symbol)?.priceInUsd ?? '0',
    [tokenPriceList, assetInfo.symbol],
  );

  const [isLoading] = useState(false);
  // const currentNetwork = useCurrentNetworkInfo();
  const contractRef = useRef<ContractBasic>();
  const tokenContractRef = useRef<ContractBasic>();

  const isTokenHasPrice = useMemo(
    () => tokenPriceList.tokenPrices.some(it => it.symbol === assetInfo.symbol),
    [tokenPriceList, assetInfo.symbol],
  );

  const isCrossChainTransfer = isCrossChain(toInfo?.address ?? '', fromChainId);
  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();

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
    if (!wallet) throw new Error('unlocked wallet is null');
    const {
      caInfo: { caHash },
    } = wallet;

    if (!contractRef.current) {
      contractRef.current = await getContractInstanceOnParticularChain(fromChainId);
    }

    const contract = contractRef.current;
    const amount = timesDecimals(sendNumber, tokenInfo.decimals).toFixed();

    if (!isApproved) {
      const checkTransferLimitResult = await checkTransferLimitWithJump(
        {
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals,
          amount: String(sendNumber),
          chainId: fromChainId,
        },
        fromChainId,
      );
      if (!checkTransferLimitResult) return;
    }

    if (isCrossChainTransfer) {
      if (!tokenContractRef.current) {
        tokenContractRef.current = await getTokenContract(fromChainId, tokenContractAddress);
      }
      const tokenContract = tokenContractRef.current;

      if (!tokenContract || !contract) throw new Error('tokenContract or contract is null');

      const crossChainTransferResult = await crossChainTransfer({
        tokenContract,
        contract,
        chainType: 'aelf',
        managerAddress: wallet.address,
        tokenInfo: { ...assetInfo, address: assetInfo.address } as unknown as BaseToken,
        caHash: caHash || '',
        amount,
        crossDefaultFee: typeof crossDefaultFee === 'string' ? Number(crossDefaultFee) : crossDefaultFee,
        toAddress: toInfo?.address ?? '',
        guardiansApproved,
      });

      console.log('crossChainTransferResult', crossChainTransferResult);
    } else {
      console.log('sameChainTransfers==sendHandler', tokenInfo);
      const sameTransferResult = await sameChainTransfer({
        contract,
        tokenInfo: {
          ...assetInfo,
          address: assetInfo?.tokenContractAddress || assetInfo?.address,
        } as unknown as BaseToken,
        caHash: caHash || '',
        amount,
        toAddress: toInfo?.address ?? '',
        guardiansApproved,
      });

      if (sameTransferResult.error) {
        return CommonToast.fail(sameTransferResult?.error?.message || '');
      }
      console.log('sameTransferResult', sameTransferResult);
    }

    await sleep(1500);

    navigateTo(PortkeyEntries.ASSETS_HOME_ENTRY);
    CommonToast.success('success');
  }, [
    assetInfo,
    checkTransferLimitWithJump,
    crossDefaultFee,
    fromChainId,
    guardiansApproved,
    isApproved,
    isCrossChainTransfer,
    navigateTo,
    sendNumber,
    toInfo?.address,
    tokenContractAddress,
    wallet,
  ]);

  const retryCrossChain = useCallback(
    async (managerTransferTxId: string, data: CrossChainTransferIntervalParams) => {
      Loading.show();
      try {
        if (!tokenContractRef.current) {
          tokenContractRef.current = await getTokenContract(fromChainId, tokenContractAddress);
        }
        const tokenContract = tokenContractRef.current;
        await intervalCrossChainTransfer(tokenContract, data);
        // dispatch(removeFailedActivity(managerTransferTxId));
        navigateTo(PortkeyEntries.ASSETS_HOME_ENTRY);
        CommonToast.success('success');
      } catch (error) {
        showRetry(() => {
          retryCrossChain(managerTransferTxId, data);
        });
      }
      Loading.hide();
    },
    [fromChainId, navigateTo, showRetry, tokenContractAddress],
  );

  const onSend = useCallback(async () => {
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
        // dispatch(
        //   addFailedActivity({
        //     transactionId: error.managerTransferTxId,
        //     params: error.data,
        //   }),
        // );
        showRetry(() => {
          retryCrossChain(error.managerTransferTxId, error.data);
        });
        return;
      } else {
        CommonToast.failError(error);
      }
    }
    Loading.hide();
  }, [retryCrossChain, showRetry, transfer]);

  useEffect(() => {
    if (!isAutoSend) return;
    onSend();
  }, [isAutoSend, onSend]);

  const networkInfoShow = (address: string) => {
    const chainId = address.split('_')[2] as ChainId;
    return formatChainInfoToShow(chainId);
  };

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={`${t('Send')}${sendType === 'token' ? ' ' + assetInfo.symbol : ''}`}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {sendType === 'nft' ? (
        <View style={styles.topWrap}>
          {!assetInfo?.imageUrl ? (
            <Text style={styles.noImg}>{assetInfo?.alias[0]}</Text>
          ) : (
            <CommonAvatar avatarSize={pTd(64)} style={styles.img} imageUrl={assetInfo?.imageUrl || ''} />
          )}
          <View style={styles.topLeft}>
            <TextL style={[styles.nftTitle, fonts.mediumFont]}>{`${assetInfo.alias} #${assetInfo?.tokenId}`} </TextL>
            <TextS style={[FontStyles.font3]}>{`Amount：${sendNumber}`}</TextS>
          </View>
        </View>
      ) : (
        <>
          <Text style={[styles.tokenCount, FontStyles.font5, fonts.mediumFont]}>
            {`- ${formatAmountShow(sendNumber)} ${assetInfo?.symbol}`}
          </Text>
          {!isTestnet && isTokenHasPrice && (
            <TextM style={styles.tokenUSD}>{`-$ ${formatAmountShow(
              ZERO.plus(sendNumber).multipliedBy(tokenPrice),
              2,
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
              <TextM style={styles.blackFontColor}>{walletName}</TextM>
            </View>
            <View style={[styles.flexSpaceBetween]}>
              <TextM style={styles.lightGrayFontColor} />
              <TextS style={styles.lightGrayFontColor}>
                {formatStr2EllipsisStr(addressFormat(wallet?.caInfo?.caAddress, assetInfo.chainId))}
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
              <TextM style={[styles.blackFontColor, GStyles.alignEnd]}>{`→${networkInfoShow(
                toInfo?.address ?? '',
              )}`}</TextM>
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
            {!isTestnet && (
              <View>
                <TextM />
                <TextS style={[styles.blackFontColor, styles.lightGrayFontColor, GStyles.alignEnd]}>{`$ ${unitConverter(
                  ZERO.plus(transactionFee).multipliedBy(tokenPrice),
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
                    <TextM style={[styles.blackFontColor, styles.fontBold, GStyles.alignEnd]}>{`${unitConverter(
                      crossDefaultFee,
                    )} ${defaultToken.symbol}`}</TextM>
                    {!isTestnet ? (
                      <TextS
                        style={[
                          styles.blackFontColor,
                          styles.lightGrayFontColor,
                          GStyles.alignEnd,
                        ]}>{`$ ${unitConverter(ZERO.plus(crossDefaultFee).multipliedBy(tokenPrice))}`}</TextS>
                    ) : (
                      <TextM />
                    )}
                  </View>
                </View>
              </View>
              <Text style={[styles.divider, styles.marginTop0]} />
            </>
          )}
          {isCrossChainTransfer && assetInfo.symbol === defaultToken.symbol && (
            <View style={styles.section}>
              <View style={[styles.flexSpaceBetween]}>
                <TextM style={[styles.blackFontColor, styles.fontBold, styles.leftTitle, GStyles.alignEnd]}>
                  {t('Estimated amount received')}
                </TextM>
                <View>
                  <TextM style={[styles.blackFontColor, styles.fontBold, GStyles.alignEnd]}>
                    {ZERO.plus(sendNumber).isLessThanOrEqualTo(ZERO.plus(crossDefaultFee))
                      ? '0'
                      : formatAmountShow(ZERO.plus(sendNumber).minus(ZERO.plus(crossDefaultFee)))}{' '}
                    {defaultToken.symbol}
                  </TextM>
                  {!isTestnet ? (
                    <TextS style={[styles.blackFontColor, styles.lightGrayFontColor, GStyles.alignEnd]}>{`$ ${
                      ZERO.plus(sendNumber).isLessThanOrEqualTo(ZERO.plus(crossDefaultFee))
                        ? '0'
                        : formatAmountShow(ZERO.plus(sendNumber).minus(ZERO.plus(crossDefaultFee)).times(tokenPrice), 2)
                    }`}</TextS>
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
    backgroundColor: defaultColors.bg4,
    height: ScreenHeight - pTd(80),
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
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
    marginBottom: getBottomSpace(),
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
