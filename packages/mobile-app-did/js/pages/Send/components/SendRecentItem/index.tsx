import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { RecentContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import Collapsible from 'components/Collapsible';
import { TextL, TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { memo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';
import { ChainId } from '@portkey-wallet/types';
import navigationService from 'utils/navigationService';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';

export interface ItemType {
  fromChainId?: ChainId;
  contact: RecentContactItemType;
  isContacts?: boolean;
  onPress?: (item: any) => void;
}

const SendRecentItem: React.FC<ItemType> = props => {
  const { isContacts, contact, fromChainId, onPress } = props;

  const { currentNetwork } = useWallet();
  const [collapsed, setCollapsed] = useState(true);

  if (contact?.name)
    return (
      <View style={styles.itemWrap}>
        <Touchable style={styles.topWrap} onPress={() => setCollapsed(!collapsed)}>
          <CommonAvatar
            hasBorder
            resizeMode="cover"
            title={(contact?.name || contact?.caHolderInfo?.walletName || contact.imInfo?.name)?.toUpperCase()}
            avatarSize={pTd(36)}
            imageUrl={contact.avatar || ''}
            style={styles.itemAvatar}
          />
          <TextL style={styles.contactName}>{contact.name}</TextL>
          <Svg icon={collapsed ? 'down-arrow' : 'up-arrow'} size={pTd(20)} />
        </Touchable>

        <Collapsible collapsed={collapsed} style={styles.addressListWrap}>
          {contact?.addresses?.map((ele, index) =>
            isContacts || ele?.transactionTime ? (
              <Touchable
                style={[index !== 0 && styles.addressItemWrap]}
                key={`${ele?.address}${ele?.chainId}`}
                onPress={() => {
                  const { address, chainId } = ele;
                  onPress?.({ address: addressFormat(address, chainId), name: contact.name });
                }}>
                <TextM style={[styles.address, !isContacts && !ele?.transactionTime && FontStyles.font7]}>
                  {formatStr2EllipsisStr(addressFormat(ele?.address, ele.chainId), 10)}
                </TextM>
                <TextS
                  style={[styles.address, styles.chainInfo, !isContacts && !ele?.transactionTime && FontStyles.font7]}>
                  {formatChainInfoToShow(ele?.chainId as ChainId, currentNetwork)}
                </TextS>
                <Touchable
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  style={[styles.contactActivity, styles.moreIconWrapStyle]}
                  onPress={() =>
                    navigationService.navigate('ContactActivity', {
                      address: ele.address,
                      chainId: ele.chainId,
                      contactName: contact.name,
                      fromChainId,
                      avatar: contact.avatar,
                    })
                  }>
                  <Svg icon="more-info" size={pTd(20)} />
                </Touchable>
              </Touchable>
            ) : (
              <View style={[index !== 0 && styles.addressItemWrap]} key={`${ele?.address}${ele?.chainId}`}>
                <TextM style={[styles.address, !ele?.transactionTime && FontStyles.font7]}>
                  {formatStr2EllipsisStr(addressFormat(ele.address, ele.chainId), 10)}
                </TextM>
                <TextS style={[styles.address, styles.chainInfo, !ele?.transactionTime && FontStyles.font7]}>
                  {formatChainInfoToShow(ele?.chainId as ChainId, currentNetwork)}
                </TextS>
                <Touchable
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  style={[styles.contactActivity, styles.moreIconWrapStyle]}
                  onPress={() =>
                    navigationService.navigate('ContactActivity', {
                      address: ele.address,
                      chainId: ele.chainId,
                      contactName: contact.name,
                      fromChainId,
                      avatar: contact.avatar,
                    })
                  }>
                  <Svg icon="more-info" size={pTd(20)} />
                </Touchable>
              </View>
            ),
          )}
        </Collapsible>
      </View>
    );

  return (
    <Touchable
      style={styles.itemWrap}
      onPress={() => {
        onPress?.({ address: `ELF_${contact.address}_${contact.addressChainId}`, name: '' });
      }}>
      <TextM style={FontStyles.font5}>
        {formatStr2EllipsisStr(addressFormat(contact.address, contact?.addressChainId as ChainId), 10)}
      </TextM>
      <TextS style={styles.chainInfo1}>
        {formatChainInfoToShow(contact?.addressChainId as ChainId, currentNetwork)}
      </TextS>
      <TextM
        style={[styles.contactActivity]}
        onPress={() =>
          navigationService.navigate('ContactActivity', {
            address: contact.address,
            chainId: contact.addressChainId,
            fromChainId,
          })
        }>
        <Svg icon="more-info" size={pTd(20)} />
      </TextM>
    </Touchable>
  );
};

export default memo(SendRecentItem);

export const styles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    ...GStyles.paddingArg(16, 20),
    position: 'relative',
    borderBottomColor: defaultColors.bg7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.bg1,
  },
  itemAvatar: {
    marginRight: pTd(10),
  },
  topWrap: {
    ...GStyles.flexRowWrap,
    alignItems: 'center',
  },
  contactName: {
    flex: 1,
  },
  addressListWrap: {
    paddingTop: pTd(10),
    paddingBottom: pTd(10),
    marginLeft: pTd(48),
  },
  addressItemWrap: {
    marginTop: pTd(16),
    position: 'relative',
  },
  address: {
    color: defaultColors.font3,
    width: '100%',
  },
  chainInfo: {
    marginTop: pTd(4),
  },
  itemNameWrap: {
    flex: 1,
  },
  itemName: {
    color: defaultColors.font3,
  },
  chainInfo1: {
    marginTop: pTd(4),
    color: defaultColors.font11,
  },
  contactActivity: {
    position: 'absolute',
    right: pTd(11),
    top: pTd(17),
    padding: pTd(10),
  },
  moreIconWrapStyle: {
    top: pTd(1),
    right: -pTd(10),
  },
});
