import React, { useCallback, useMemo } from 'react';
import { useLanguage } from 'i18n/hooks';
import { makeStyles } from '@rneui/themed';
import { useTheme } from '@rneui/themed';
import { View, FlatList, Text } from 'react-native';
import CommonTopTab from 'components/CommonTopTab';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import ContactItem from 'components/ContactItem';
import { IContactItemType, TFormattedRecentItem } from '@portkey-wallet/types/types-ca/contactNew';
import navigationService from 'utils/navigationService';
import { ICaAddressInfoListItemType } from '@portkey-wallet/hooks/hooks-ca/wallet';

interface IAddress {
  avatar?: string;
  nickName?: string;
  address: string;
  chain?: string;
}

interface ISelectAddressTabProps {
  recentAddressList: TFormattedRecentItem[];
  savedAddressList: TFormattedRecentItem[];
  myAddressList: TFormattedRecentItem[];
  noDataMessage: string;
  chainId: string;
  onPress?: (item: TFormattedRecentItem) => void;
}

const AddressList = ({
  addressList,
  onPress,
  isMyAddress = false,
}: {
  addressList: TFormattedRecentItem[] | ICaAddressInfoListItemType[];
  chainId: string;
  onPress?: (item: TFormattedRecentItem) => void;
  isMyAddress?: boolean;
}) => {
  const styles = getStyles();
  const {
    theme: { colors },
  } = useTheme();

  const renderItem = useCallback(
    ({ item, index }: { item: TFormattedRecentItem | ICaAddressInfoListItemType | any; index: number }) => {
      const address = item?.name ? item?.caHolderInfo?.address : item?.address;
      const contactProps: IContactItemType = item?.name
        ? item
        : {
            id: address,
            index: String(index),
            name: item?.name || address,
            addressInfo: {
              network: item?.network,
              networkName: item?.chainId || '',
              networkImage: item?.networkIcon,
              address: address,
            },
            caHolderInfo: item?.caHolderInfo,
            userId: address,
            modificationTime: item?.transferTime,
            isDeleted: false,
          };
      const isSaved = item?.name ? true : false;
      return (
        <ContactItem
          contact={contactProps}
          showInfoIcon={!isMyAddress}
          isSaved={isSaved}
          onPress={() => {
            onPress?.(item);
          }}
          onInfoIconPress={() => {
            navigationService.navigate('NoChatContactProfile', {
              contact: contactProps,
              isSaved,
            });
          }}
        />
      );
      // return (
      //   <Touchable style={[styles.addressRow, index !== 0 && styles.addressRowMT]}>
      //     <CommonAvatar
      //       style={styles.avatar}
      //       color={colors.textBrand4}
      //       title={item.nickName || address}
      //       avatarSize={pTd(40)}
      //       imageUrl={item.avatar}
      //     />
      //     <View style={styles.infoWrap}>
      //       <View>
      //         <Text style={styles.textAbove} numberOfLines={1} ellipsizeMode={'tail'}>
      //           {textAbove}
      //         </Text>
      //         {textBelow && (
      //           <Text style={styles.textBelow} numberOfLines={1} ellipsizeMode={'tail'}>
      //             {textBelow}
      //           </Text>
      //         )}
      //       </View>
      //     </View>
      //     <Svg iconStyle={styles.infoIcon} icon="info" color={colors.iconBase1} size={pTd(24)} />
      //   </Touchable>
      // );
    },
    [isMyAddress, onPress],
  );

  return (
    <View style={styles.addressListWrap}>
      <FlatList
        nestedScrollEnabled
        refreshing={false}
        data={addressList || []}
        renderItem={renderItem}
        keyExtractor={item => item?.address || ''}
      />
    </View>
  );
};

const SelectAddressTab: React.FC<ISelectAddressTabProps> = (props: ISelectAddressTabProps) => {
  const { t } = useLanguage();
  const { recentAddressList, savedAddressList, myAddressList, chainId, onPress } = props;
  console.log('recentAddressList', recentAddressList);

  const tabList = useMemo(() => {
    return [
      {
        name: t('Recent'),
        tabItemDom: <AddressList addressList={recentAddressList} chainId={chainId} onPress={onPress} />,
      },
      {
        name: t('Saved'),
        tabItemDom: <AddressList addressList={savedAddressList} chainId={chainId} onPress={onPress} />,
      },
      {
        name: t('My addresses'),
        tabItemDom: <AddressList addressList={myAddressList} chainId={chainId} onPress={onPress} isMyAddress={true} />,
      },
    ];
  }, [t, recentAddressList, chainId, onPress, savedAddressList, myAddressList]);

  return <CommonTopTab hasTabBarBorderRadius={false} hasBottomBorder={false} tabList={tabList} swipeEnabled />;

  // return (
  //   <View>
  //     <CommonTopTab hasTabBarBorderRadius={false} hasBottomBorder={false} tabList={tabList} swipeEnabled />
  //     <View style={styles.emptyWrap}>
  //       <Text style={styles.emptyText}>{noDataMessage}</Text>
  //     </View>
  //   </View>
  // );
};

export default SelectAddressTab;

const getStyles = makeStyles(theme => ({
  addressListWrap: {
    flex: 1,
    paddingVertical: pTd(8),
    backgroundColor: theme.colors.bgBase1,
  },
  addressRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: pTd(16),
  },
  addressRowMT: {
    marginTop: pTd(16),
  },
  avatar: {
    width: pTd(40),
    height: pTd(40),
    backgroundColor: theme.colors.bgBrand1,
  },
  infoWrap: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: pTd(12),
  },
  textAbove: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase2,
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
  textBelow: {
    marginTop: pTd(2),
    ...fonts.SGRegularFont,
    color: theme.colors.textBase3,
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
  infoIcon: {
    marginLeft: pTd(12),
  },
  emptyWrap: {
    marginTop: pTd(48),
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textBase3,
  },
}));
