import React, { memo, useEffect, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { FlatList, View, StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from 'components/CommonText';
import { makeStyles } from '@rneui/themed';
import navigationService from 'utils/navigationService';
import { FontStyles } from 'assets/theme/styles';
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
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useTransferLimitList } from '@portkey-wallet/hooks/hooks-ca/security';
import { darkColors } from 'assets/theme';
import Loading from 'components/Loading';

const _renderPaymentSecurityItem = ({ item }: { item: ITransferLimitItem }) => {
  const defaultToken = useDefaultToken();
  const symbolImages = useSymbolImages();
  const { networkType } = useCurrentNetworkInfo();
  const ItemStyles = getStyles();
  return (
    <Touchable
      onPress={() => {
        navigationService.navigate('PaymentSecurityDetail', { transferLimitDetail: item });
      }}>
      <View style={ItemStyles.wrap}>
        <View style={ItemStyles.iconWrap}>
          <CommonAvatar
            hasBorder
            shapeType="circular"
            title={item.symbol}
            style={ItemStyles.tokenIcon}
            svgName={item.symbol === defaultToken.symbol ? 'elf-icon' : undefined}
            imageUrl={item.imageUrl || symbolImages[item.symbol]}
            avatarSize={pTd(40)}
            titleStyle={FontStyles.font11}
            borderStyle={GStyles.hairlineBorder}
          />
          <CommonAvatar
            hasBorder={true}
            style={ItemStyles.chainIcon}
            title={item?.chainId}
            avatarSize={pTd(20)}
            imageUrl={item?.chainImageUrl}
            borderStyle={ItemStyles.tokenIconBorder}
          />
        </View>
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
const getStyles = makeStyles(() => ({
  wrap: {
    flexDirection: 'row',
    paddingVertical: pTd(16),
    height: pTd(74),
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
  iconWrap: {
    width: pTd(45),
    height: pTd(42),
    position: 'relative',
  },
  tokenIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  tokenIconBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkColors.borderBase1,
  },
  chainIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
}));

const PaymentSecurityList: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { list, isNext, next, init } = useTransferLimitList(); // isNext
  const pageStyles = getListStyles();
  const getList = useLockCallback(async () => {
    if (!isNext) {
      return;
    }
    setIsRefreshing(true);
    try {
      await next();
    } catch (error) {
      console.log('PaymentSecurityList: error', error);
      CommonToast.failError('Failed to fetch data');
    }
    setIsRefreshing(false);
  }, [next]);

  useEffect(() => {
    if (!list || list.length === 0) {
      Loading.show();
    } else {
      Loading.hide();
    }
  }, [list]);

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
      titleDom={'Transaction Limits'}
      containerStyles={pageStyles.pageWrap}
      hideTouchable={true}
      scrollViewProps={{ disabled: true }}>
      <FlatList
        refreshing={isRefreshing}
        data={list || []}
        keyExtractor={(item: ITransferLimitItem) => `${item.chainId}_${item.symbol}`}
        renderItem={({ item }) => <PaymentSecurityItem item={item} />}
        onRefresh={() => init()}
        onEndReached={() => getList()}
      />
    </PageContainer>
  );
};

const getListStyles = makeStyles(() => ({
  pageWrap: {},
  tipsWrap: {
    lineHeight: pTd(20),
    marginBottom: pTd(24),
  },
}));

export default PaymentSecurityList;
