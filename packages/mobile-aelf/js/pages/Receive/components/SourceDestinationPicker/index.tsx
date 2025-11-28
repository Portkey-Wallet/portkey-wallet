import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { TReceiveFromNetworkItem } from '@portkey-wallet/types/types-eoa/receive';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';
import { makeStyles } from '@rneui/themed';
import CommonAvatar from 'components/CommonAvatar';
import Svg from 'components/Svg';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { ViewStyleType } from 'types/styles';
import GStyles from 'assets/theme/GStyles';

export function SourceDestinationItem({
  title,
  icon,
  chainName,
  onPress,
  containerStyles,
  isReceiveNFT,
}: {
  title?: string;
  icon: string;
  chainName: string;
  containerStyles?: ViewStyleType;
  isReceiveNFT?: boolean;
  onPress: () => void;
}) {
  const styles = getStyles();
  return (
    <TouchableOpacity style={[styles.itemWrapper, containerStyles]} onPress={onPress}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.itemChianWrapper}>
        <View style={styles.iconAndName}>
          <CommonAvatar avatarSize={pTd(16)} imageUrl={icon} height={pTd(16)} />
          <Text style={[styles.chainName, !isReceiveNFT && GStyles.width(pTd(116))]} numberOfLines={1}>
            {chainName}
          </Text>
        </View>
        <Svg icon="down-arrow" size={pTd(16)} iconStyle={styles.arrowIcon} />
      </View>
    </TouchableOpacity>
  );
}

export default function SourceDestinationPicker({
  sourceChain,
  destinationChain,
  onSourcePress,
  onDestinationPress,
}: {
  sourceChain: TReceiveFromNetworkItem;
  destinationChain: IChainItemType;
  onSourcePress: () => void;
  onDestinationPress: () => void;
}) {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <SourceDestinationItem
        title="Source"
        icon={sourceChain.imageUrl}
        chainName={sourceChain.name}
        onPress={onSourcePress}
      />
      <View style={styles.divider} />
      <SourceDestinationItem
        title="Destination"
        icon={destinationChain.chainImageUrl || ''}
        chainName={formatChainInfoToShow(destinationChain.chainId)}
        onPress={onDestinationPress}
      />
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    marginTop: pTd(8),
    height: pTd(60),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(8),
    flexDirection: 'row',
  },
  itemWrapper: {
    flex: 1,
    // justifyContent: 'center',
    paddingVertical: pTd(8),
    paddingLeft: pTd(8),
    paddingRight: pTd(8),
  },
  itemChianWrapper: {
    // marginTop: pTd(8),
    // marginLeft: pTd(8),
    flexDirection: 'row',
    height: pTd(40),
  },
  title: {
    marginBottom: pTd(8),
    fontSize: pTd(12),
    color: theme.colors.textBase2,
  },
  iconAndName: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'flex-end',
  },
  chainName: {
    marginLeft: pTd(8),
    fontSize: pTd(16),
    lineHeight: pTd(17),
    color: theme.colors.textBase1,
    alignItems: 'center',
  },
  arrowIcon: {
    width: pTd(16),
    height: pTd(16),
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.borderBase1,
    height: '100%',
  },
}));
