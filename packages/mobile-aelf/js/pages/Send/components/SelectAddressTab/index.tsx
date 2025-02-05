import React, { useCallback, useMemo } from 'react';
import { useLanguage } from 'i18n/hooks';
import { makeStyles } from '@rneui/themed';
import { View, FlatList } from 'react-native';
import CommonTopTab from 'components/CommonTopTab';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import ContactItem from 'components/ContactItem';
import { IContactItemType, TFormattedRecentItem } from '@portkey-wallet/types/types-eoa/contact';
import { useContactNetworkConfig } from '@portkey-wallet/hooks/hooks-eoa/config';
import navigationService from 'utils/navigationService';
import { RECENT_PAGE_NAME } from 'constants/contact';
import { AELF_NETWORK_NAME } from 'constants/common';
import ContactItemMy, { IContactItemMyType } from 'components/ContactItemMy';
import { ChainId } from '@portkey-wallet/types';
import NoData from 'components/NoData';

interface ISelectAddressTabProps {
  recentAddressList: TFormattedRecentItem[];
  savedAddressList: TFormattedRecentItem[];
  myAddressList: IContactItemMyType[];
  chainId: ChainId;
  onPress?: (item: TFormattedRecentItem) => void;
}

const AddressList = ({
  addressList,
  onPress,
  isMyAddress = false,
  type = SelectAddressTabTypeEnum.Recent,
}: {
  // TODO: eoa contact
  // addressList: TFormattedRecentItem[] | ICaAddressInfoListItemType[];
  addressList: TFormattedRecentItem[];
  chainId: string;
  onPress?: (item: TFormattedRecentItem) => void;
  isMyAddress?: boolean;
  type: SelectAddressTabTypeEnum;
}) => {
  const styles = getStyles();
  const { supportNetworkList } = useContactNetworkConfig();
  const { t } = useLanguage();

  const getNetworkName = useCallback(
    (chainId: string, network: string) => {
      const networkItem = supportNetworkList?.find(item => {
        let isChainIdMatch = true;
        if (network === AELF_NETWORK_NAME) {
          isChainIdMatch = item.chainId === chainId;
        }
        return item.network === network && isChainIdMatch;
      });
      return networkItem?.name ?? '';
    },
    [supportNetworkList],
  );

  const renderItem = useCallback(
    // ({ item, index }: { item: TFormattedRecentItem | ICaAddressInfoListItemType | any; index: number }) => {
    ({ item, index }: { item: TFormattedRecentItem | any; index: number }) => {
      const address = item?.name ? item?.caHolderInfo?.address : item?.address;
      const contactProps: IContactItemType = item?.name
        ? item
        : {
            id: address,
            index: String(index),
            name: item?.name || address,
            addressInfo: {
              network: item?.network, // aelf ETH BSC
              networkName: getNetworkName(item?.chainId, item?.network), //  aelf MainChain
              chainId: item?.chainId ?? '', // tDVW TDVV
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
              from: RECENT_PAGE_NAME,
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
    [getNetworkName, isMyAddress, onPress],
  );

  const noData = useMemo(() => {
    return <NoData noPic message={t(`No ${type === SelectAddressTabTypeEnum.Recent ? 'recent' : 'saved'} address`)} />;
  }, [t, type]);

  return (
    <View style={styles.addressListWrap}>
      <FlatList
        nestedScrollEnabled
        refreshing={false}
        data={addressList || []}
        renderItem={renderItem}
        keyExtractor={item => item?.address || ''}
        ListEmptyComponent={noData}
      />
    </View>
  );
};

export enum SelectAddressTabTypeEnum {
  Recent = 'Recent',
  Saved = 'Saved',
}

const SelectAddressTab: React.FC<ISelectAddressTabProps> = (props: ISelectAddressTabProps) => {
  const { t } = useLanguage();
  const { recentAddressList, savedAddressList, myAddressList, chainId, onPress } = props;

  const tabList = useMemo(() => {
    return [
      {
        name: t('Recent'),
        tabItemDom: (
          <AddressList
            addressList={recentAddressList}
            chainId={chainId}
            onPress={onPress}
            type={SelectAddressTabTypeEnum.Recent}
          />
        ),
      },
      {
        name: t('Saved'),
        tabItemDom: (
          <AddressList
            addressList={savedAddressList}
            chainId={chainId}
            onPress={onPress}
            type={SelectAddressTabTypeEnum.Saved}
          />
        ),
      },
      {
        name: t('My addresses'),
        tabItemDom: <ContactItemMy addressList={myAddressList} onPress={onPress} />,
      },
    ];
  }, [t, recentAddressList, chainId, onPress, savedAddressList, myAddressList]);

  return (
    <CommonTopTab
      hasTabBarBorderRadius={false}
      hasBottomBorder={false}
      tabList={tabList}
      swipeEnabled={false}
      isBlockTab={true}
    />
  );
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
