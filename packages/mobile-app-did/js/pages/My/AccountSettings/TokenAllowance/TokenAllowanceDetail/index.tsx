import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { FontStyles } from 'assets/theme/styles';
import { Text } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import TokenAllowanceItem from '../components/TokenAllowanceItem';
import { TextL, TextM, TextXXL } from 'components/CommonText';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import Touchable from 'components/Touchable';
import { copyText, timeAgo } from 'utils';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ISymbolApprovedItem, ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import { getCurrentCaInfoByChainId } from 'utils/redux';
import { useGetCAContract } from 'hooks/contract';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { managerForwardCall } from 'utils/transfer/managerForwardCall';
import { useGetChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { LANG_MAX } from '@portkey-wallet/constants/misc';
import myEvents from 'utils/deviceEvent';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { screenHeight } from '@portkey-wallet/utils/mobile/device';
import { formatApproveSymbolShow } from '@portkey-wallet/utils/token';
import { makeStyles, useTheme } from '@rneui/themed';
import IconPair, { IIconPairProps } from '../components/IconPair';

const TokenAllowanceDetail: React.FC = () => {
  const {
    params: { item },
  } = useRoute<RouteProp<{ params: { item: ITokenAllowance } }>>();
  const caInfo = getCurrentCaInfoByChainId(item.chainId);
  const getCAContract = useGetCAContract();

  console.log('====item', item.symbolApproveList);
  const { t } = useLanguage();
  const getChain = useGetChain();

  const styles = getStyles();
  const theme = useTheme();

  const [allowanceDetail] = useState<ITokenAllowance>(item);
  const [switchMap, setSwitchMap] = useState<{ [k: string]: boolean }>({});

  const unApprove = useCallback(
    async (symbol: string) => {
      try {
        if (!switchMap[symbol]) {
          return CommonToast.warn(
            'Please interact with the dApp and initiate transaction again to enable this function.',
          );
        }

        Loading.show();
        setSwitchMap(pre => ({ ...pre, [symbol]: false }));
        const chainInfo = getChain(item.chainId);
        const caContract = await getCAContract(item.chainId);

        const unApproveReq = await managerForwardCall({
          contract: caContract,
          paramsOption: {
            caHash: caInfo?.caHash || '',
            contractAddress: chainInfo?.defaultToken.address || '',
            args: {
              spender: allowanceDetail.contractAddress,
              symbol: symbol,
              amount: LANG_MAX.toFixed(0),
            },
            methodName: 'UnApprove',
          },
        });

        if (unApproveReq?.error) {
          throw unApproveReq?.error;
        }
        // if (unApproveReq?.data) {
        //   const tokenContract = await getViewTokenContractByChainId(item.chainId);
        //   const confirmationAllowance = await getAllowance(tokenContract, {
        //     owner: caInfo?.caAddress || '',
        //     spender: allowanceDetail.contractAddress,
        //     symbol: '*',
        //   });
        // console.log('confirmationAllowance', confirmationAllowance);
        // }

        CommonToast.success('Token approval disabled');
        myEvents.refreshAllowanceList.emit();
      } catch (error) {
        setSwitchMap(pre => ({ ...pre, [symbol]: true }));
        CommonToast.failError(error);
      } finally {
        Loading.hide();
      }
    },
    [allowanceDetail.contractAddress, caInfo?.caHash, getCAContract, getChain, item.chainId, switchMap],
  );

  useEffectOnce(() => {
    const tmpMap: { [k: string]: boolean } = {};
    item?.symbolApproveList?.forEach(ele => {
      tmpMap[ele?.symbol] = !!ele.amount;
    });
    setSwitchMap(tmpMap);
    console.log(tmpMap);
  });

  const approvalList = useMemo(() => {
    return item?.symbolApproveList?.filter(i => i.amount);
  }, [item?.symbolApproveList]);

  const revokedList = useMemo(() => {
    return item?.symbolApproveList?.filter(i => !i.amount);
  }, [item?.symbolApproveList]);

  const showRevokedSection = useMemo(() => {
    return (revokedList || []).length > 0;
  }, [revokedList]);

  const getIconsPairProps = useCallback(
    (i: ISymbolApprovedItem): IIconPairProps['item'] => {
      return {
        leftSymbol: i.symbol,
        leftIcon: i.imageUrl,
        rightIcon: item.chainImageUrl || '',
        rightSymbol: item.chainId,
      };
    },
    [item.chainId, item.chainImageUrl],
  );

  return (
    <PageContainer
      titleDom={t('Token Allowances')}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      <TokenAllowanceItem type="detail" item={item} />
      <View style={styles.contractAddressWrap}>
        <TextM style={FontStyles.white}>Contract address</TextM>
        <View style={GStyles.flex1} />
        <TextM style={[GStyles.marginRight(pTd(8)), FontStyles.weight500]}>
          {formatStr2EllipsisStr(allowanceDetail.contractAddress, 6)}
        </TextM>
        <Touchable onPress={() => copyText(allowanceDetail.contractAddress)}>
          <Svg icon="copy" size={pTd(16)} />
        </Touchable>
      </View>

      <View style={styles.approveModuleTitle}>
        <TextXXL style={[FontStyles.weight500]}>Approvals</TextXXL>
        <Text style={styles.approveTitleDesc}>
          {"The dApp won't ask for your approval for the tokens below until their allowance is used up."}
        </Text>
      </View>

      {approvalList?.map((ele, key) => {
        return (
          <View key={key} style={styles.approvalWrap}>
            <View style={styles.approveTop}>
              <View style={styles.approvalLeft}>
                <IconPair item={getIconsPairProps(ele)} />
                <TextL style={styles.approveTokenSymbol}>{`${formatApproveSymbolShow(ele.symbol)}`}</TextL>
              </View>
              <Touchable
                style={styles.approvalRight}
                onPress={() => {
                  unApprove(ele.symbol);
                }}>
                <View style={styles.revokeWarp}>
                  <Svg
                    icon="allowance-delete"
                    size={pTd(18)}
                    color={theme.theme.colors.bgDanger1}
                    iconStyle={styles.revokeIcon}
                  />
                  <TextL style={[styles.revokeText, FontStyles.weight500]}>Revoke</TextL>
                </View>
              </Touchable>
            </View>
            <View style={styles.approveMid} />
            <View style={styles.approveBottom}>
              <TextM style={styles.approveAmountText}>Approved amount</TextM>
              <TextM style={[styles.approveAmount, FontStyles.weight500]}>
                {formatTokenAmountShowWithDecimals(ele.amount, ele.decimals)}
              </TextM>
            </View>
          </View>
        );
      })}

      {showRevokedSection && (
        <View style={[styles.approveModuleTitle, styles.revokedModuleTitle]}>
          <TextXXL style={[FontStyles.weight500]}>Revoked</TextXXL>
          <Text style={styles.approveTitleDesc}>
            {'To re-approve token allowance, go to the dApp site and initiate a transaction of the token type.'}
          </Text>
        </View>
      )}

      {revokedList?.map((ele, key) => {
        return (
          <View key={key} style={[styles.approvalWrap]}>
            <View style={styles.approveTop}>
              <View style={styles.approvalLeft}>
                <IconPair item={getIconsPairProps(ele)} />
                <TextL style={styles.approveTokenSymbol}>{`${formatApproveSymbolShow(ele.symbol)}`}</TextL>
              </View>
              <TextM style={styles.revokedTimeText}>{`Revoked ${timeAgo(ele.updateTime)}`}</TextM>
            </View>
          </View>
        );
      })}
    </PageContainer>
  );
};

export default TokenAllowanceDetail;

const getStyles = makeStyles(theme => ({
  pageWrap: {
    height: screenHeight,
    backgroundColor: theme.colors.bg6,
    ...GStyles.paddingArg(24, 16),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  approveModuleTitle: {},
  revokedModuleTitle: {
    marginTop: pTd(32),
  },
  approveTitleDesc: {
    marginTop: pTd(4),
    fontSize: pTd(14),
    lineHeight: pTd(20),
    color: theme.colors.textBase2,
  },
  contractAddressWrap: {
    paddingVertical: pTd(16),
    marginBottom: pTd(12),
    backgroundColor: theme.colors.bg6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  approvalWrap: {
    marginTop: pTd(12),
    borderRadius: pTd(8),
    padding: pTd(16),
    backgroundColor: theme.colors.bgBase2,
  },
  revokedWrap: {
    marginTop: pTd(32),
  },
  approveTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveMid: {
    height: pTd(0.5),
    width: '100%',
    marginVertical: pTd(16),
    backgroundColor: theme.colors.bgBase3,
  },
  approveTokenSymbol: {
    marginLeft: pTd(8),
  },
  approvalLeft: {
    flex: 1,
    paddingRight: pTd(16),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  approvalRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  revokeWarp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  revokeIcon: {
    marginRight: theme.spacing.xs,
  },
  revokeText: {
    color: theme.colors.bgDanger1,
  },
  approveBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveAmountText: {
    color: theme.colors.textBase2,
  },
  approveAmount: {
    color: theme.colors.textBase2,
  },
  revokedTimeText: {
    color: theme.colors.textBase2,
  },
}));
