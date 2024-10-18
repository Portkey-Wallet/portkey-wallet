import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
import { View, FlatList } from 'react-native';
import { TextL, TextM } from 'components/CommonText';
import { darkColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import Touchable from 'components/Touchable';
import { IAssetNftCollection, INftInfoType } from '@portkey-wallet/store/store-ca/assets/type';
import NoData from 'components/NoData';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import GStyles from 'assets/theme/GStyles';
import { DarkFontStyles } from 'assets/theme/styles';
import NFTAvatar from 'components/NFTAvatar';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';

export interface SelectNFTProps {
  nftInfos: IAssetNftCollection[];
  noDataMessage: string;
}

export default function SelectNFT({ nftInfos, noDataMessage }: SelectNFTProps) {
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();

  const onNavigate = useCallback((nft: INftInfoType) => {
    navigationService.navigate('SendHome', {
      sendType: 'nft',
      assetInfo: { ...nft, symbol: '' },
      toInfo: {
        name: '',
        address: '',
      },
    } as unknown as IToSendHomeParamsType);
  }, []);

  const renderNFTItem = useCallback(
    ({ item: nft }: { item: INftInfoType }) => {
      return (
        <Touchable style={itemStyle.nftItemWrap} onPress={() => onNavigate(nft)}>
          <NFTAvatar disabled isSeed={nft.isSeed} seedType={nft.seedType} nftSize={pTd(42)} data={nft} />
          <View style={itemStyle.nftItemRight}>
            <View>
              <TextL numberOfLines={1} style={{ lineHeight: pTd(22) }} ellipsizeMode={'tail'}>
                {`${nft.alias} #${nft.tokenId}`}
              </TextL>
              <TextM
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={[DarkFontStyles.textBase2, { lineHeight: pTd(20) }]}>
                {`${nft.displayChainName || ''} ${!isMainnet && 'Testnet'}`}
              </TextM>
            </View>
            <View>
              <TextL>{formatTokenAmountShowWithDecimals(nft.balance, nft.decimals)}</TextL>
            </View>
          </View>
        </Touchable>
      );
    },
    [isMainnet, onNavigate],
  );

  const renderItem = useCallback(
    ({ item }: { item: IAssetNftCollection }) => {
      return (
        <View>
          <View style={itemStyle.collectionWrap}>
            <NFTAvatar
              disabled
              isSeed={false}
              nftSize={pTd(24)}
              data={{ alias: item.collectionName, imageUrl: item.imageUrl }}
              // style={itemStyle.left}
            />
            <TextL style={itemStyle.collectionName}>{item.collectionName}</TextL>
          </View>
          <FlatList
            nestedScrollEnabled
            refreshing={false}
            // extraData={extraIndex}
            data={item.items || []}
            renderItem={renderNFTItem}
            keyExtractor={nft => `${nft.alias}_${nft.tokenId}`}
            ListEmptyComponent={() => <NoData noPic message={t(noDataMessage)} />}
          />
        </View>
      );
    },
    [noDataMessage, renderNFTItem, t],
  );

  return (
    <View style={itemStyle.nftListPageWrap}>
      <FlatList
        nestedScrollEnabled
        refreshing={false}
        // extraData={extraIndex}
        data={nftInfos || []}
        renderItem={renderItem}
        keyExtractor={item => item.collectionName}
        ListEmptyComponent={() => <NoData noPic message={t(noDataMessage)} />}
      />
    </View>
  );
}

const itemStyle = StyleSheet.create({
  nftListPageWrap: {
    flex: 1,
    backgroundColor: darkColors.bgBase1,
  },
  collectionWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...GStyles.marginArg(16, 8, 8, 8),
    ...GStyles.paddingArg(8),
    height: pTd(40),
    backgroundColor: darkColors.bgBase2,
    borderRadius: pTd(8),
  },
  collectionName: {
    color: darkColors.textBase2,
    marginLeft: pTd(8),
  },
  nftItemWrap: {
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...GStyles.paddingArg(16),
  },
  nftItemRight: {
    height: pTd(42),
    marginLeft: pTd(8),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
