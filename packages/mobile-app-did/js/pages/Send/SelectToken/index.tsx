import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
import { View, FlatList } from 'react-native';
import { TextL, TextM } from 'components/CommonText';
import { darkColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import Touchable from 'components/Touchable';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { IAssetToken } from '@portkey-wallet/store/store-ca/assets/type';
import NoData from 'components/NoData';
import CommonAvatar from 'components/CommonAvatar';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import GStyles from 'assets/theme/GStyles';
import { DarkFontStyles } from 'assets/theme/styles';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';

export interface SelectTokenProps {
  tokenInfos: IAssetToken[];
  noDataMessage: string;
}

export default function SelectToken({ tokenInfos, noDataMessage }: SelectTokenProps) {
  const { t } = useLanguage();
  const userInfo = useCurrentUserInfo();
  const isMainnet = useIsMainnet();

  const onNavigate = useCallback((tokenItem: IAssetToken) => {
    navigationService.navigate('SendHome', {
      sendType: 'token',
      assetInfo: tokenItem,
      toInfo: {
        name: '',
        address: '',
      },
    } as unknown as IToSendHomeParamsType);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: IAssetToken }) => {
      return (
        <Touchable style={itemStyle.wrap} onPress={() => onNavigate(item)}>
          <CommonAvatar
            hasBorder
            shapeType="circular"
            title={item.symbol}
            // svgName={item.symbol === defaultToken.symbol ? 'testnet' : undefined}
            imageUrl={item.imageUrl}
            avatarSize={pTd(40)}
            style={itemStyle.left}
            // titleStyle={FontStyles.font11}
            borderStyle={GStyles.hairlineBorder}
          />

          <View style={itemStyle.right}>
            <View>
              <TextL numberOfLines={1} ellipsizeMode={'tail'}>
                {item.label || item.symbol}
              </TextL>
              <TextM numberOfLines={1} style={DarkFontStyles.textBase2} ellipsizeMode={'tail'}>
                {`${item.displayChainName || ''} ${!isMainnet && 'Testnet'}`}
              </TextM>
            </View>
            <View>
              <TextL numberOfLines={1} ellipsizeMode={'tail'}>
                {userInfo.hideAssets ? '****' : formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
              </TextL>
              {isMainnet && item.balanceInUsd && (
                <TextM numberOfLines={1} style={DarkFontStyles.textBase2} ellipsizeMode={'tail'}>
                  {userInfo.hideAssets ? '****' : formatAmountUSDShow(item.balanceInUsd)}
                </TextM>
              )}
            </View>
          </View>
        </Touchable>
      );
    },
    [isMainnet, onNavigate, userInfo.hideAssets],
  );

  return (
    <View style={itemStyle.tokenListPageWrap}>
      <FlatList
        nestedScrollEnabled
        refreshing={false}
        // extraData={extraIndex}
        data={tokenInfos || []}
        renderItem={renderItem}
        ListEmptyComponent={() => <NoData noPic message={t(noDataMessage)} />}
      />
    </View>
  );
}

const itemStyle = StyleSheet.create({
  tokenListPageWrap: {
    flex: 1,
    backgroundColor: darkColors.bgBase1,
  },
  wrap: {
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    marginLeft: pTd(16),
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
