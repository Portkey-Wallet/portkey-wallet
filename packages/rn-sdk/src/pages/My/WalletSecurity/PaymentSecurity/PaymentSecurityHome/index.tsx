import React, { memo, useCallback, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, FlatList, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from '@portkey-wallet/rn-components/components/CommonText';

import { BGStyles, FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import isEqual from 'lodash/isEqual';
import CommonAvatar from '@portkey-wallet/rn-components/components/CommonAvatar';
import CommonSvg from '@portkey-wallet/rn-components/components/Svg';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import NoData from '@portkey-wallet/rn-components/components/NoData';
import { ITransferLimitItem } from 'model/security';
import { useTransferLimitList } from 'model/hooks/payment';
import { useCurrentNetworkInfo } from 'hooks/network';
import { useCommonNetworkInfo, useSymbolImages } from 'components/TokenOverlay/hooks';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { PaymentSecurityDetailProps } from '../PaymentSecurityDetail';
import { GuardiansApprovalIntent } from 'pages/GuardianManage/GuardianHome';
import { useInitCaches } from 'global/init/caches';

const _renderPaymentSecurityItem = ({ item }: { item: ITransferLimitItem }) => {
  const { defaultToken } = useCommonNetworkInfo();
  const symbolImages = useSymbolImages();
  const networkType = useCurrentNetworkInfo();
  const { navigateTo } = useBaseContainer({
    entryName: PortkeyEntries.PAYMENT_SECURITY_HOME_ENTRY,
  });

  return (
    <Touchable
      onPress={() => {
        navigateTo<PaymentSecurityDetailProps>(PortkeyEntries.PAYMENT_SECURITY_DETAIL_ENTRY, {
          params: {
            transferLimitDetail: item,
          },
        });
      }}>
      <View style={ItemStyles.wrap}>
        <CommonAvatar
          hasBorder
          shapeType="circular"
          title={item.symbol}
          svgName={item.symbol === defaultToken.symbol ? 'elf-icon' : undefined}
          imageUrl={symbolImages[item.symbol]}
          avatarSize={pTd(32)}
        />
        <View style={ItemStyles.content}>
          <TextL style={ItemStyles.symbolLabel}>{item.symbol || ''}</TextL>
          <TextM style={FontStyles.font7}>{formatChainInfoToShow(item.chainId, networkType)}</TextM>
        </View>
        <CommonSvg icon="right-arrow" size={pTd(20)} color={defaultColors.icon1} />
      </View>
    </Touchable>
  );
};
const PaymentSecurityItem = memo(_renderPaymentSecurityItem, (prevProps, nextProps) =>
  isEqual(prevProps.item, nextProps.item),
);

const ItemStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(24),
    height: pTd(72),
    borderRadius: pTd(6),
    alignItems: 'center',
  },
  content: {
    marginHorizontal: pTd(16),
    flex: 1,
  },
  symbolLabel: {
    marginBottom: pTd(2),
  },
});

const PaymentSecurityList = ({ containerId }: { containerId: string }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { list, isNext, next, init } = useTransferLimitList();
  useInitCaches();
  useBaseContainer({
    entryName: PortkeyEntries.PAYMENT_SECURITY_HOME_ENTRY,
    onNewIntent: (intent: GuardiansApprovalIntent) => {
      console.log('PaymentSecurityList onNewIntent', intent);
      if (intent.result === 'success') {
        CommonToast.success('edit success');
      }
    },
    containerId,
    onShow: () => {
      init();
    },
  });

  const getList = useCallback(async () => {
    if (!isNext) return;
    setIsRefreshing(true);
    try {
      await next();
    } catch (error) {
      console.log('PaymentSecurityList: error', error);
      CommonToast.failError('Failed to fetch data');
    }
    setIsRefreshing(false);
  }, [isNext, next]);

  return (
    <PageContainer
      titleDom={'Payment Security'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      hideTouchable={true}
      scrollViewProps={{ disabled: true }}>
      <FlatList
        style={pageStyles.listWrap}
        refreshing={isRefreshing}
        data={list || []}
        keyExtractor={(item: ITransferLimitItem) => `${item.chainId}_${item.symbol}`}
        renderItem={({ item }) => <PaymentSecurityItem item={item} />}
        onRefresh={() => init()}
        onEndReached={() => getList()}
        ListEmptyComponent={() => <NoData style={BGStyles.bg4} topDistance={pTd(95)} message="No asset" />}
      />
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg4,
    paddingHorizontal: 0,
    display: 'flex',
    flex: 1,
  },
  listWrap: {
    ...GStyles.paddingArg(24, 20, 18),
  },
  tipsWrap: {
    lineHeight: pTd(20),
    marginBottom: pTd(24),
  },
});

export default PaymentSecurityList;
