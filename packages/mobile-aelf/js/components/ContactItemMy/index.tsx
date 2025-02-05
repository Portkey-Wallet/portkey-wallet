import { makeStyles } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { Text } from 'react-native';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-eoa/activity';
import { AELF_NETWORK_NAME } from 'constants/common';
import { addressFormat } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { formatStr2EllipsisStr } from 'components/ContactAddress';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

export interface IContactItemMyType {
  address: string;
  avatarImg: string;
  network: string;
  isExchange?: boolean;
  chainId: ChainId;
  [key: string]: any;
}
export interface ItemTypeMy {
  addressList: Array<IContactItemMyType>;
  onPress?: (item: IContactItemMyType) => void;
}

const ContactItemMy: React.FC<ItemTypeMy> = props => {
  const { addressList, onPress } = props;
  const styles = getStyles();
  const { avatar, nickName } = useCurrentUserInfo();

  const myOtherAddress = useMemo(() => {
    return addressList?.[0];
  }, [addressList]);

  const addressFormatStr = useMemo(() => {
    const { address, network, isExchange = false, chainId } = myOtherAddress ?? {};
    if (network === AELF_NETWORK_NAME) {
      if (isExchange && chainId === MAIN_CHAIN_ID) {
        return address;
      }
      return addressFormat(address, chainId, network);
    }
    return address;
  }, [myOtherAddress]);

  const addressEllipsisStr = useMemo(() => {
    const { network } = myOtherAddress ?? {};
    if (network === AELF_NETWORK_NAME) {
      return formatStr2EllipsisStr(addressFormatStr, 8, 9);
    }
    return formatStr2EllipsisStr(addressFormatStr, 6, 4);
  }, [myOtherAddress, addressFormatStr]);

  const networkName = useMemo(() => {
    const { network, chainId } = myOtherAddress ?? {};
    return `${network} ${chainId === MAIN_CHAIN_ID ? 'MainChain' : 'dAppChain'}`;
  }, [myOtherAddress]);

  return (
    <View style={styles.listWrap}>
      <Touchable onPress={() => onPress?.(myOtherAddress)}>
        <View style={styles.itemWrap}>
          <View style={[styles?.avatarWrap]}>
            <CommonAvatar
              title={nickName}
              resizeMode="cover"
              avatarSize={pTd(42)}
              imageUrl={avatar || ''}
              style={styles.itemAvatar}
              titleStyle={styles.itemAvatarTitle}
            />
            <View style={styles.avatarNetworkIcon}>
              <Svg size={pTd(20)} icon={myOtherAddress?.chainId === 'AELF' ? 'mainnet' : 'sideChain'} />
            </View>
          </View>
          <View style={styles.itemNameWrap}>
            <Text style={styles.primaryText}>{addressEllipsisStr}</Text>
            <TextL style={styles.secondaryText}>{networkName || ''}</TextL>
          </View>
        </View>
      </Touchable>
    </View>
  );
};

export default memo(ContactItemMy);

export const getStyles = makeStyles(theme => ({
  listWrap: {
    backgroundColor: theme.colors.bgBase1,
    flex: 1,
    paddingVertical: pTd(8),
  },
  itemWrap: {
    height: pTd(66),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...GStyles.paddingArg(12, 16),
  },
  itemAvatar: {
    backgroundColor: theme.colors.iconBrand2,
  },
  itemAvatarTitle: {
    color: theme.colors.textBrand4,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  itemNameWrap: {
    flex: 1,
  },
  primaryText: {
    color: theme.colors.textBase1,
    lineHeight: pTd(22),
  },
  secondaryText: {
    color: theme.colors.textBase2,
    lineHeight: pTd(20),
    fontSize: pTd(14),
  },
  avatarWrap: {
    position: 'relative',
    width: pTd(42),
    height: pTd(42),
    marginRight: pTd(10),
  },
  avatarNetworkIcon: {
    position: 'absolute',
    right: pTd(-5),
    bottom: pTd(-2),
    borderColor: theme.colors.borderBase1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(10),
  },
}));
