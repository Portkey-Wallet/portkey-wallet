import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import TokenAllowanceItem from '../components/TokenAllowanceItem';
import { TextM, TextS } from 'components/CommonText';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import Touchable from 'components/Touchable';
import { copyText } from 'utils';
import CommonSwitch from 'components/CommonSwitch';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import { getCurrentCaInfoByChainId } from 'utils/redux';
import { useGetCAContract } from 'hooks/contract';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { managerForwardCall } from 'utils/transfer/managerForwardCall';
import { useGetChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { LANG_MAX } from '@portkey-wallet/constants/misc';
import myEvents from 'utils/deviceEvent';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { screenHeight } from '@portkey-wallet/utils/mobile/device';

const TokenAllowanceDetail: React.FC = () => {
  const {
    params: { item },
  } = useRoute<RouteProp<{ params: { item: ITokenAllowance } }>>();
  const caInfo = getCurrentCaInfoByChainId(item.chainId);
  const getCAContract = useGetCAContract();

  const { t } = useLanguage();
  const getChain = useGetChain();

  const [allowanceDetail] = useState<ITokenAllowance>(item);
  const [switchMap, setSwitchMap] = useState<{ [k: string]: boolean }>({});

  const unApprove = useCallback(
    async (symbol: string) => {
      try {
        if (!switchMap[symbol])
          return CommonToast.warn(
            'Please interact with the dApp and initiate transaction again to enable this function.',
          );

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

        if (unApproveReq?.error) throw unApproveReq?.error;
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

  return (
    <PageContainer
      titleDom={t('Token Allowance')}
      safeAreaColor={['white', 'white']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      <TokenAllowanceItem type="detail" item={item} />
      <View style={pageStyles.contractAddressWrap}>
        <TextM style={FontStyles.font16}>Contract Address</TextM>
        <View style={GStyles.flex1} />
        <TextM style={[GStyles.marginRight(pTd(8)), FontStyles.font3]}>
          {formatStr2EllipsisStr(allowanceDetail.contractAddress, 6)}
        </TextM>
        <Touchable onPress={() => copyText(allowanceDetail.contractAddress)}>
          <Svg icon="copy" size={pTd(16)} />
        </Touchable>
      </View>

      {item?.symbolApproveList?.map((ele, key) => {
        return (
          <View key={key} style={pageStyles.approvalWrap}>
            <View style={pageStyles.approveTop}>
              <View style={pageStyles.approvalLeft}>
                <TextM style={FontStyles.primaryTextColor}>{`Approve ${ele.symbol}`}</TextM>
                <View style={GStyles.width(pTd(2))} />
                <TextS style={FontStyles.font3}>
                  This will approve access to all tokens and the dApp will not request your approval until the allowance
                  is exhausted.
                </TextS>
              </View>
              <Touchable
                style={pageStyles.approvalRight}
                onPress={() => {
                  unApprove(ele.symbol);
                }}>
                <View pointerEvents="none">
                  <CommonSwitch value={switchMap?.[ele.symbol]} />
                </View>
              </Touchable>
            </View>
            {switchMap?.[ele.symbol] && (
              <View
                style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.height(pTd(20)), GStyles.marginTop(pTd(12))]}>
                <TextM style={FontStyles.primaryTextColor}>Approve Amount</TextM>
                <TextM style={FontStyles.secondaryTextColor}>{formatAmountShow(ele.amount, ele.decimals)}</TextM>
              </View>
            )}
          </View>
        );
      })}
    </PageContainer>
  );
};

export default TokenAllowanceDetail;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    height: screenHeight,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  contractAddressWrap: {
    borderRadius: pTd(6),
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(18),
    marginBottom: pTd(24),
    backgroundColor: defaultColors.bg1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  approvalWrap: {
    marginBottom: pTd(16),
    borderRadius: pTd(6),
    padding: pTd(16),
    backgroundColor: defaultColors.bg1,
  },
  approveTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  approvalLeft: {
    flex: 1,
    paddingRight: pTd(16),
  },
  approvalRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
