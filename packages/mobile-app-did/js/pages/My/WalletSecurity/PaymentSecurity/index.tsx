import React, { memo, useEffect, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, FlatList, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

import navigationService from 'utils/navigationService';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonToast from 'components/CommonToast';
import Touchable from 'components/Touchable';
import { IPaymentSecurityItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import isEqual from 'lodash/isEqual';
import CommonAvatar from 'components/CommonAvatar';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import Svg from 'components/Svg';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { request } from '@portkey-wallet/api/api-did';
import NoData from 'components/NoData';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

const _renderPaymentSecurityItem = ({ item }: { item: IPaymentSecurityItem }) => {
  const defaultToken = useDefaultToken();
  const symbolImages = useSymbolImages();
  const { networkType } = useCurrentNetworkInfo();

  return (
    <Touchable
      onPress={() => {
        navigationService.navigate('PaymentSecurityDetail', { paymentSecurityDetail: item });
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
          <TextM style={ItemStyles.symbolLabel}>{item.symbol || ''}</TextM>
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

const PAGE_LIMIT = 20;
const PaymentSecurityList: React.FC = () => {
  const wallet = useCurrentWalletInfo();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [list, setList] = useState<Array<any>>();
  const paginationRef = useRef({ page: 0, pageSize: PAGE_LIMIT, total: -1 });

  const getList = useLockCallback(
    async (isInit = false) => {
      const pagination = paginationRef.current;
      if (isInit) {
        pagination.page = 0;
        pagination.total = -1;
      }
      if (pagination.total !== -1 && pagination.total <= pagination.page * pagination.pageSize) {
        return;
      }
      pagination.page++;

      setIsRefreshing(true);
      try {
        const result = await request.security.securityList({
          params: {
            caHash: wallet.caHash,
            skipCount: (pagination.page - 1) * pagination.pageSize,
            maxResultCount: pagination.pageSize,
          },
        });
        if (result.data && result.totalRecordCount !== undefined) {
          pagination.total = result.totalRecordCount;
          if (isInit) {
            setList(result.data);
          } else {
            setList(prev => {
              return [...(prev || []), ...result.data];
            });
          }
        }
      } catch (error) {
        console.log('PaymentSecurityList: error', error);
        CommonToast.failError(error);
      }

      setIsRefreshing(false);
    },
    [wallet.caHash],
  );

  useEffectOnce(() => {
    const timer = setTimeout(() => {
      getList(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  });

  useEffect(() => {
    const listener = myEvents.refreshPaymentSecurityList.addListener(() => {
      console.log('refreshPaymentSecurityList');
      getList(true);
    });
    return () => {
      listener.remove();
    };
  }, [getList]);

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
        keyExtractor={(item: IPaymentSecurityItem) => `${item.chainId}_${item.symbol}`}
        renderItem={({ item }) => <PaymentSecurityItem item={item} />}
        onRefresh={() => getList(true)}
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
