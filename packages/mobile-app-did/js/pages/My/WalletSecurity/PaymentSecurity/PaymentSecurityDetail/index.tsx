import React, { useCallback, useMemo, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { View } from 'react-native';
import { defaultColors } from 'assets/theme';
import CustomSwitch from 'components/CustomSwitch';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { TextL, TextM, TextS } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { divDecimalsToShow } from '@portkey-wallet/utils/converter';
import { useGetTransferLimit } from '@portkey-wallet/hooks/hooks-ca/security';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useGetCurrentCAContract } from 'hooks/contract';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { ApprovalType } from '@portkey-wallet/types/verifier';
import CommonAvatar from 'components/CommonAvatar';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import GStyles from 'assets/theme/GStyles';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import OverlayModal from 'components/OverlayModal';
import EditModal from '../components/EditModal';
import { makeStyles, useTheme } from '@rneui/themed';
import fonts from 'assets/theme/fonts';

interface RouterParams {
  transferLimitDetail?: ITransferLimitItem;
}

const PaymentSecurityDetail: React.FC = () => {
  const {
    params: { transferLimitDetail },
  } = useRoute<RouteProp<{ params: RouterParams }>>();
  const pageStyles = getStyles();
  const { theme } = useTheme();
  const [detail, setDetail] = useState<ITransferLimitItem | undefined>(transferLimitDetail);
  const getCurrentCAContract = useGetCurrentCAContract(transferLimitDetail?.chainId);
  const getTransferLimit = useGetTransferLimit();

  const caContractRef = useRef<ContractBasic>();
  const getDetail = useCallback(async () => {
    if (!caContractRef.current) {
      try {
        caContractRef.current = await getCurrentCAContract();
      } catch (error) {
        console.log('PaymentSecurityDetail: caContract error');
        return;
      }
    }

    const caContract = caContractRef.current;
    try {
      const result = await getTransferLimit({
        caContract,
        symbol: transferLimitDetail?.symbol || '',
      });
      if (result) {
        console.log('PaymentSecurityDetail: getDetail', result);
        setDetail(pre => {
          if (pre) {
            return {
              ...pre,
              ...result,
            };
          }
          return pre;
        });
      }
    } catch (error) {
      console.log('PaymentSecurityDetail: getTransferLimit error');
    }
  }, [getCurrentCAContract, getTransferLimit, transferLimitDetail?.symbol]);
  const getDetailRef = useLatestRef(getDetail);

  useFocusEffect(
    useCallback(() => {
      getDetailRef.current();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const detailFormatted = useMemo(() => {
    if (!detail) {
      return undefined;
    }
    return {
      ...detail,
      singleLimit: divDecimalsToShow(detail.singleLimit, detail.decimals),
      dailyLimit: divDecimalsToShow(detail.dailyLimit, detail.decimals),
    };
  }, [detail]);

  const onRestrictedChange = useCallback((value: boolean) => {
    if (!value) {
      // close
      navigationService.navigate('GuardianApproval', {
        approvalType: ApprovalType.modifyTransferLimit,
        transferLimitDetail: {
          chainId: detail?.chainId,
          symbol: detail?.symbol,
          singleLimit: '-1',
          dailyLimit: '-1',
          restricted: false,
          decimals: detail?.decimals,
        },
        targetChainId: detail?.chainId,
      });
    } else {
      OverlayModal.show(<EditModal detail={detail} />, {
        position: 'bottom',
      });
    }
  }, []);

  const defaultToken = useDefaultToken();
  const symbolImages = useSymbolImages();
  const { networkType } = useCurrentNetworkInfo();

  return (
    <PageContainer
      titleDom={'Transaction Limits'}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <View style={pageStyles.infoWrap}>
          <CommonAvatar
            hasBorder
            shapeType="circular"
            title={detailFormatted?.symbol}
            svgName={detailFormatted?.symbol === defaultToken.symbol ? 'elf-icon' : undefined}
            imageUrl={detailFormatted?.imageUrl || symbolImages[detailFormatted?.symbol || '']}
            avatarSize={pTd(80)}
            titleStyle={FontStyles.font11}
            borderStyle={GStyles.hairlineBorder}
          />
          <View style={pageStyles.infoContent}>
            <TextL style={pageStyles.symbolLabel}>{detailFormatted?.symbol || ''}</TextL>
            <TextM style={FontStyles.font7}>{formatChainInfoToShow(detailFormatted?.chainId, networkType)}</TextM>
          </View>
        </View>
        <View style={pageStyles.switchWrap}>
          <View style={pageStyles.switchContainer}>
            <TextM style={pageStyles.switchLeft}>Transaction limits</TextM>
            <CustomSwitch value={detailFormatted?.restricted || false} onToggle={onRestrictedChange} />
          </View>
          <TextS style={{ color: theme.colors.textBase2, fontSize: pTd(14), lineHeight: pTd(20) }}>
            Transactions over the limit require you to modify the limit settings with guardian approval.
          </TextS>
        </View>
        {detailFormatted?.restricted ? (
          <>
            <View style={pageStyles.labelWrap}>
              <TextM style={pageStyles.labelText}>Limit per Transaction</TextM>
              <TextM style={pageStyles.contentText}>{`${detailFormatted?.singleLimit || ''} ${
                detailFormatted?.symbol || ''
              }`}</TextM>
            </View>
            <View style={pageStyles.labelWrap}>
              <TextM style={pageStyles.labelText}>Daily Limit</TextM>
              <TextM style={pageStyles.contentText}>{`${detailFormatted?.dailyLimit || ''} ${
                detailFormatted?.symbol || ''
              }`}</TextM>
            </View>
          </>
        ) : (
          <></>
        )}
      </View>
      <CommonButton
        type="primary"
        style={{ marginBottom: pTd(14) }}
        onPress={() => {
          OverlayModal.show(<EditModal detail={detail} />, {
            position: 'bottom',
          });
        }}>
        Edit
      </CommonButton>
    </PageContainer>
  );
};

const getStyles = makeStyles(_ => ({
  pageWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  labelWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pTd(54),
    alignItems: 'center',
  },
  labelText: {
    fontSize: pTd(16),
  },
  contentText: {
    fontSize: pTd(16),
    ...fonts.mediumFont,
  },
  infoWrap: {
    marginVertical: pTd(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: pTd(8),
  },
  symbolLabel: {
    fontSize: pTd(16),
  },
  switchWrap: {
    flexDirection: 'column',
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(16),
    backgroundColor: defaultColors.bg43,
    marginBottom: pTd(12),
    borderRadius: pTd(8),
    height: pTd(100),
  },
  switchContainer: {
    flexDirection: 'row',
    height: pTd(24),
    marginBottom: pTd(5),
    alignItems: 'center',
  },
  switchLeft: {
    flex: 1,
    justifyContent: 'center',
  },
}));

export default PaymentSecurityDetail;
