import React, { useCallback, useEffect, useMemo } from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ViewStyle } from 'react-native';
import { ISelectBaseProps, OnSelectFinishCallback } from '../Entry';
import { TNetworkItem, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import CommonAvatar from 'components/CommonAvatar';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import { useGStyles } from 'assets/theme/useGStyles';
import { RequestNetworkTokenDataProps, getFixedChainIdName, useMemoNetworkAndTokenData } from '../Entry/model';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import { ChainId } from '@portkey-wallet/types';

enum Layers {
  LAYER1,
  LAYER2,
}

enum FocusedOnType {
  TopTwo,
  All,
  More,
}

type OnSelectNetworkCallback = (network: TNetworkItem) => void;

export const SelectNetworkModal = (props: ISelectBaseProps & { isPay?: boolean }) => {
  const { networkList, currentToken, currentNetwork, onResolve, onReject, isPay = false } = props;
  const [layer, setLayer] = useState(Layers.LAYER1);
  const { symbol } = currentToken;
  const [currentChoosingNetwork, setCurrentChoosingNetwork] = useState(currentNetwork);
  const [lastTimeTargetNetwork, setLastTimeTargetNetwork] = useState<TNetworkItem | undefined>();
  const gStyle = useGStyles();
  const [focusedOn, setFocusedOn] = useState(FocusedOnType.TopTwo);
  const networkOverflowNum = useMemo(() => {
    return networkList.length - 2;
  }, [networkList]);
  const topTwoNetworks = useMemo(() => {
    const arr: TNetworkItem[] = [];
    if (lastTimeTargetNetwork) {
      if (isNetworkItemEqual(lastTimeTargetNetwork, currentNetwork)) {
        arr.push(currentNetwork);
        arr.push(networkList.find(it => !isNetworkItemEqual(it, currentNetwork)) || networkList[0]);
      } else {
        arr.push(lastTimeTargetNetwork);
        arr.push(currentNetwork);
      }
    } else {
      arr.push(currentNetwork);
      arr.push(networkList.find(it => !isNetworkItemEqual(it, currentNetwork)) || networkList[0]);
    }
    return arr;
  }, [currentNetwork, lastTimeTargetNetwork, networkList]);
  const onNetworkBtnClick = useCallback((type: FocusedOnType, networkItem?: TNetworkItem) => {
    setFocusedOn(type);
    if (type === FocusedOnType.TopTwo) {
      networkItem && setCurrentChoosingNetwork(networkItem);
    } else if (type === FocusedOnType.More) {
      setLayer(Layers.LAYER2);
    }
  }, []);
  const { networkAndTokenData, updateNetworkAndTokenData } = useMemoNetworkAndTokenData();

  useEffect(() => {
    if (!networkList) return;
    const type = isPay ? 'from' : 'to';
    const isShowAll = focusedOn === FocusedOnType.All;
    const prep: RequestNetworkTokenDataProps = { type };
    if (!isShowAll && isPay) {
      prep.network = currentChoosingNetwork.network;
    }
    if (!isPay && !isShowAll) {
      prep.chainId = (currentChoosingNetwork.name || 'AELF') as ChainId;
    }
    updateNetworkAndTokenData(prep, isShowAll ? networkList : [currentChoosingNetwork], isShowAll && !isPay);
  }, [
    currentChoosingNetwork,
    currentChoosingNetwork.name,
    currentChoosingNetwork.network,
    currentNetwork,
    focusedOn,
    isPay,
    networkList,
    updateNetworkAndTokenData,
  ]);

  const networkBtns = useMemo<Array<JSX.Element>>(() => {
    const array: Array<JSX.Element> = [];
    array.push(
      <NetworkTopBtn
        reportPress={onNetworkBtnClick}
        type={FocusedOnType.All}
        focused={focusedOn === FocusedOnType.All}
        networkOverflowNum={networkOverflowNum}
        isPay={isPay}
      />,
    );
    if (topTwoNetworks) {
      topTwoNetworks.forEach(networkItem => {
        array.push(
          <NetworkTopBtn
            reportPress={onNetworkBtnClick}
            type={FocusedOnType.TopTwo}
            focused={focusedOn === FocusedOnType.TopTwo && isNetworkItemEqual(networkItem, currentChoosingNetwork)}
            networkItem={networkItem}
            containerStyle={{ marginLeft: pTd(8) }}
            networkOverflowNum={networkOverflowNum}
            isPay={isPay}
          />,
        );
      });
    }
    if (networkOverflowNum > 0) {
      array.push(
        <NetworkTopBtn
          reportPress={onNetworkBtnClick}
          type={FocusedOnType.More}
          focused={focusedOn === FocusedOnType.More}
          networkOverflowNum={networkOverflowNum}
          containerStyle={{ marginLeft: pTd(8) }}
          isPay={isPay}
        />,
      );
    }
    return array;
  }, [currentChoosingNetwork, focusedOn, isPay, networkOverflowNum, onNetworkBtnClick, topTwoNetworks]);
  return (
    <ModalBody
      isShowLeftBackIcon={layer === Layers.LAYER2}
      isShowRightCloseIcon={layer === Layers.LAYER1}
      preventBack
      onBack={() => setLayer(Layers.LAYER1)}
      onClose={() => {
        onReject?.('user canceled');
      }}
      style={gStyle.overlayStyle}
      title={layer === Layers.LAYER1 ? (isPay ? 'Pay' : 'Receive') : 'Select Network'}
      modalBodyType="bottom">
      {layer === Layers.LAYER1 && (
        <View style={styles.container}>
          <View style={styles.layerBlock}>
            <Text style={styles.layerBlockTitle}>{'Select a network'}</Text>
            <View style={styles.networkBtnLine}>{networkBtns}</View>
          </View>
          <View style={styles.layerBlock}>
            <Text style={styles.layerBlockTitle}>{'Select a token'}</Text>
            <FlatList
              data={networkAndTokenData}
              keyExtractor={(item, index) => `${item.network.network}-${index}`}
              renderItem={({ item }) => (
                <TokenListItem
                  item={item.token}
                  onSelect={onResolve}
                  underNetwork={item.network}
                  isReceive={!isPay}
                  isShowAll={focusedOn === FocusedOnType.All}
                />
              )}
            />
          </View>
        </View>
      )}
      {layer === Layers.LAYER2 && (
        <View>
          <View style={[styles.wrap, styles.flex]}>
            <Svg icon="more-info" size={pTd(16)} iconStyle={styles.icon} color={defaultColors.bg30} />
            <Text
              style={
                styles.commonText
              }>{`Note: Please select from the supported networks listed below. Sending ${symbol} from other networks may result in the loss of your assets.`}</Text>
          </View>
          <FlatList
            data={networkList}
            keyExtractor={(item, index) => `${item.network}-${index}`}
            renderItem={({ item }) => (
              <NetworkListItem
                item={item}
                onSelect={network => {
                  console.log('choosing network', network);
                  setCurrentChoosingNetwork(network);
                  setLastTimeTargetNetwork(network);
                  setFocusedOn(FocusedOnType.TopTwo);
                  setLayer(Layers.LAYER1);
                }}
              />
            )}
          />
        </View>
      )}
    </ModalBody>
  );
};

const NetworkListItem = (props: { item: TNetworkItem; onSelect: OnSelectNetworkCallback }) => {
  const { item, onSelect } = props;
  const { network, name, multiConfirm, multiConfirmTime } = item;

  return (
    <TouchableOpacity
      style={styles.networkItem}
      onPress={() => {
        onSelect(item);
      }}>
      <Image style={styles.networkIcon} source={getNetworkImagePath(network)} resizeMode={'contain'} />
      <View style={styles.networkTextLines}>
        <Text style={[styles.networkTextMain, fonts.mediumFont]}>{name}</Text>
        <Text style={styles.networkTextSub}>{`Arrival Time ≈ ${multiConfirmTime}`}</Text>
        <Text style={styles.networkTextSub}>{multiConfirm}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NetworkTopBtn = (props: {
  reportPress: (type: FocusedOnType, networkItem?: TNetworkItem) => void;
  type: FocusedOnType;
  focused: boolean;
  networkItem?: TNetworkItem;
  networkOverflowNum: number;
  containerStyle?: ViewStyle;
  isPay?: boolean;
}) => {
  const { reportPress, type, focused, networkItem, networkOverflowNum, containerStyle, isPay = false } = props;
  const isTopTwo = type === FocusedOnType.TopTwo;
  const isAll = type === FocusedOnType.All;

  const text = useMemo(() => {
    if (isAll) return 'All';
    if (isTopTwo) {
      const name = removeQuoteFromStr(networkItem?.name || 'ETH');
      return isPay ? name : getFixedChainIdName(name);
    }
    return `${networkOverflowNum}+`;
  }, [isAll, isPay, isTopTwo, networkItem?.name, networkOverflowNum]);

  return (
    <TouchableOpacity
      style={[styles.networkBtn, focused ? styles.networkBtnFocused : styles.networkBtnNotFocused, containerStyle]}
      onPress={() => {
        reportPress(type, networkItem);
      }}>
      {isTopTwo && (
        <Image
          style={styles.networkBtnIcon}
          source={getNetworkImagePath(networkItem?.network || 'ETH')}
          resizeMode={'contain'}
        />
      )}
      <TextM
        style={[styles.networkBtnText, fonts.mediumFont, isPay ? { maxWidth: pTd(95) } : undefined]}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        {text}
      </TextM>
    </TouchableOpacity>
  );
};

const getNetworkImagePath = (network: string) => {
  switch (network) {
    case 'ETH':
      return require('../../../assets/image/pngs/third-party-ethereum.png');
    case 'AELF':
      return require('../../../assets/image/pngs/aelf.png');
    case 'BSC':
      return require('../../../assets/image/pngs/third-party-bnb.png');
    case 'TRX':
      return require('../../../assets/image/pngs/third-party-tron.png');
    case 'ARBITRUM':
      return require('../../../assets/image/pngs/third-party-arb.png');
    case 'Solana':
      return require('../../../assets/image/pngs/third-party-solana.png');
    case 'MATIC':
      return require('../../../assets/image/pngs/third-party-polygon.png');
    case 'OPTIMISM':
      return require('../../../assets/image/pngs/third-party-op.png');
    case 'AVAXC':
      return require('../../../assets/image/pngs/third-party-avax.png');
    default: {
      return require('../../../assets/image/pngs/third-party-solana.png');
    }
  }
};

const TokenListItem = (props: {
  item: TTokenItem;
  onSelect: OnSelectFinishCallback;
  underNetwork: TNetworkItem;
  isReceive: boolean;
  isShowAll: boolean;
}) => {
  const { item, onSelect, underNetwork, isReceive, isShowAll } = props;
  const { symbol, name, icon, contractAddress } = item;
  const { name: networkName } = underNetwork;

  return (
    <TouchableOpacity
      style={styles.tokenItem}
      onPress={() => {
        onSelect({
          token: item,
          network: underNetwork,
        });
      }}>
      <View style={styles.tokenIconBox}>
        <CommonAvatar
          hasBorder
          style={styles.tokenIconMain}
          avatarSize={pTd(36)}
          imageUrl={icon}
          borderStyle={GStyles.hairlineBorder}
        />
        {isShowAll && (
          <View style={styles.subIcon}>
            <Image style={styles.subIcon} source={getNetworkImagePath(underNetwork.network)} resizeMode={'contain'} />
          </View>
        )}
      </View>
      <View style={styles.tokenTextLines}>
        <View style={styles.tokenTextMain}>
          <Text style={[styles.tokenSymbol, fonts.mediumFont]}>{symbol}</Text>
          <Text style={styles.tokenDetail}>{name}</Text>
        </View>
        {isShowAll && (
          <Text style={styles.tokenTextSub}>{isReceive ? getFixedChainIdName(networkName) : contractAddress}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const removeQuoteFromStr = (str: string) => {
  return str.replace(/\(.*\)/g, '');
};

const isNetworkItemEqual = (a: TNetworkItem, b: TNetworkItem) => {
  return a.network === b.network && a.name === b.name;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(8),
  },
  layerBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: pTd(24),
  },
  layerBlockTitle: {
    lineHeight: pTd(22),
    color: defaultColors.font11,
    marginBottom: pTd(8),
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: pTd(16),
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: pTd(16),
  },
  tokenIconBox: {
    height: pTd(36),
    width: pTd(36),
    display: 'flex',
    flexDirection: 'row',
  },
  tokenIconMain: {
    height: pTd(36),
    width: pTd(36),
    zIndex: 1,
  },
  subIcon: {
    zIndex: 2,
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: pTd(16),
    width: pTd(16),
    borderRadius: pTd(8),
    borderStyle: 'solid',
    borderWidth: pTd(1),
    borderColor: '#fff',
  },
  tokenTextLines: {
    flexDirection: 'column',
    marginLeft: pTd(10),
  },
  tokenTextMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tokenSymbol: {
    color: defaultColors.font5,
    lineHeight: pTd(24),
  },
  tokenDetail: {
    color: defaultColors.font11,
    lineHeight: pTd(16),
    marginLeft: pTd(8),
  },
  tokenTextSub: {
    color: defaultColors.font11,
    lineHeight: pTd(16),
  },
  networkIcon: {
    height: pTd(20),
    width: pTd(20),
    zIndex: 1,
  },
  networkTextLines: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: pTd(10),
  },
  networkTextMain: {
    lineHeight: pTd(22),
    color: defaultColors.font20,
  },
  networkTextSub: {
    lineHeight: pTd(16),
    color: defaultColors.font19,
  },
  networkBtnLine: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  networkBtn: {
    paddingHorizontal: pTd(6),
    paddingVertical: pTd(5),
    borderWidth: 0.5,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkBtnIcon: {
    height: pTd(20),
    width: pTd(20),
    marginRight: pTd(6),
  },
  networkBtnText: {
    fontFamily: 'Roboto-Regular',
    lineHeight: pTd(22),
    color: defaultColors.font5,
  },
  networkBtnNotFocused: {
    borderColor: defaultColors.bg30,
  },
  networkBtnFocused: {
    backgroundColor: defaultColors.bg33,
    borderColor: defaultColors.primaryColor,
  },
  wrap: {
    backgroundColor: defaultColors.bg39,
    paddingVertical: pTd(12),
    paddingHorizontal: pTd(8),
    marginHorizontal: pTd(16),
    borderRadius: pTd(6),
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  wrapperText: {
    flex: 1,
    paddingLeft: pTd(6),
  },
  commonText: {
    fontSize: pTd(12),
    lineHeight: pTd(16),
    color: defaultColors.font11,
    paddingRight: pTd(16),
  },
  icon: {
    marginTop: pTd(2),
    marginRight: pTd(6),
  },
});
