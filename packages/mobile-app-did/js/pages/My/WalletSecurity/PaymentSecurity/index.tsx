import React, { memo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, FlatList, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from 'components/CommonText';

import navigationService from 'utils/navigationService';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonToast from 'components/CommonToast';
import Touchable from 'components/Touchable';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import isEqual from 'lodash/isEqual';
import CommonAvatar from 'components/CommonAvatar';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import Svg from 'components/Svg';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import NoData from 'components/NoData';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useTransferLimitList } from '@portkey-wallet/hooks/hooks-ca/security';

const _renderPaymentSecurityItem = ({ item }: { item: ITransferLimitItem }) => {
  const defaultToken = useDefaultToken();
  const symbolImages = useSymbolImages();
  const { networkType } = useCurrentNetworkInfo();

  return (
    <Touchable
      onPress={() => {
        navigationService.navigate('PaymentSecurityDetail', { transferLimitDetail: item });
      }}>
      <View style={ItemStyles.wrap}>
        <CommonAvatar
          hasBorder
          shapeType="circular"
          title={item.symbol}
          svgName={item.symbol === defaultToken.symbol ? 'elf-icon' : undefined}
          imageUrl={item.imageUrl || symbolImages[item.symbol]}
          avatarSize={pTd(32)}
          titleStyle={FontStyles.font11}
          borderStyle={GStyles.hairlineBorder}
        />
        <View style={ItemStyles.content}>
          <TextL style={ItemStyles.symbolLabel}>{item.symbol || ''}</TextL>
          <TextM style={FontStyles.font7}>{formatChainInfoToShow(item.chainId, networkType)}</TextM>
        </View>
        <Svg icon="right-arrow" size={pTd(20)} color={defaultColors.icon1} />
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

const PaymentSecurityList: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { list, isNext, next, init } = useTransferLimitList();

  const getList = useLockCallback(async () => {
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

  useEffectOnce(() => {
    const timer = setTimeout(() => {
      init();
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <PageContainer
      titleDom={'Payment Security'}
      safeAreaColor={['white', 'gray']}
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
