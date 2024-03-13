import { ChainId } from '@portkey/provider-types';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextS } from 'components/CommonText';
import NoData from 'components/NoData';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import { FlashList } from '@shopify/flash-list';
import { ON_END_REACHED_THRESHOLD } from 'packages/constants/constants-ca/activity';
import { ContactItemType } from 'packages/im';
import React, { useMemo, useCallback } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import MyAddressItem from '../components/MyAddressItem';
import SendContactItem from '../components/SendContactItem';
import SendRecentItem from '../components/SendRecentItem';
import { useUnlockedWallet } from 'model/wallet';
import ContactsList from 'components/ContactList';
import { RecentContactItemType } from 'network/dto/query';
import { useContact, useRecent } from 'model/hooks/contact';
import { RNTabView, TabProps } from 'model/hooks/tabs';

interface SelectContactProps {
  chainId: ChainId;
  onPress?: (contact: any) => void;
}

export default function SelectContact(props: SelectContactProps) {
  const { chainId, onPress } = props;

  const { t } = useLanguage();
  const { items: userContactList } = useContact();
  const contactList = useMemo(() => {
    return userContactList.filter(item => {
      return !item.isDeleted;
    });
  }, [userContactList]);
  const { wallet } = useUnlockedWallet({ getMultiCaAddresses: true });
  const caAddressInfos = useMemo(
    () =>
      Object.entries(wallet?.multiCaAddresses || {}).map(([itemChainId, caAddress]) => {
        return {
          chainId: itemChainId as ChainId,
          caAddress,
          chainName: itemChainId,
        };
      }),
    [wallet],
  );

  const {
    recent: { data: recentContactList, totalRecordCount },
    loadMoreRecent,
  } = useRecent();

  const renderRecentItem = useCallback(
    ({ item }: { item: RecentContactItemType }) => {
      return <SendRecentItem fromChainId={chainId} contact={item} onPress={onPress} />;
    },
    [chainId, onPress],
  );

  const isExistContact = useMemo<boolean>(() => contactList.length > 0, [contactList]);

  const myOtherAddressList = useMemo(() => {
    return caAddressInfos.filter(item => item.chainId !== chainId);
  }, [caAddressInfos, chainId]);

  useEffectOnce(() => {
    loadMoreRecent();
  });

  const tabList = useMemo(() => {
    return [
      {
        key: t('Recents'),
        title: t('Recents'),
        component: () => (
          <View
            style={[
              styles.recentListWrap,
              { width: Dimensions.get('screen').width, height: Dimensions.get('screen').height },
            ]}>
            <FlashList
              data={recentContactList || []}
              renderItem={renderRecentItem}
              estimatedItemSize={pTd(80)}
              ListFooterComponent={
                <TextS style={styles.footer}>{recentContactList?.length === 0 ? '' : t('No More Data')}</TextS>
              }
              ListEmptyComponent={<NoData noPic message={t('There is no recents')} />}
              refreshing={false}
              onRefresh={() => loadMoreRecent(true)}
              onEndReached={() => {
                if (recentContactList.length >= totalRecordCount) return;
                loadMoreRecent();
              }}
              onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
            />
          </View>
        ),
      },
      {
        key: t('Contacts'),
        title: t('Contacts'),
        component: () =>
          !isExistContact ? (
            <NoData noPic message={t('There is no contacts')} />
          ) : (
            <ContactsList
              isReadOnly
              style={styles.contactWrap}
              contactData={contactList}
              isIndexBarShow={false}
              isSearchShow={false}
              renderContactItem={(item: ContactItemType) => (
                <SendContactItem
                  fromChainId={chainId}
                  isContacts={true}
                  contact={item as RecentContactItemType}
                  onPress={onPress}
                />
              )}
              ListFooterComponent={<View style={styles.footer} />}
            />
          ),
      },
      {
        key: t('My address'),
        title: t('My address'),
        component: () => (
          <View
            style={[
              styles.recentListWrap,
              { width: Dimensions.get('screen').width, height: Dimensions.get('screen').height },
            ]}>
            <FlashList
              data={myOtherAddressList || []}
              estimatedItemSize={pTd(80)}
              renderItem={({ item }) => (
                <MyAddressItem chainId={item.chainId} address={item.caAddress} onPress={onPress} />
              )}
              ListEmptyComponent={<NoData noPic message={t('There is no address')} />}
            />
          </View>
        ),
      },
    ] as TabProps[];
  }, [
    chainId,
    isExistContact,
    loadMoreRecent,
    myOtherAddressList,
    onPress,
    recentContactList,
    renderRecentItem,
    t,
    totalRecordCount,
    contactList,
  ]);

  return useMemo(() => <RNTabView tabs={tabList} defaultTab={'Recents'} />, [tabList]);
}

const styles = StyleSheet.create({
  inputWrap: {
    backgroundColor: defaultColors.bg5,
    ...GStyles.paddingArg(0, 16, 16),
  },
  flatList: {
    backgroundColor: defaultColors.bg1,
  },
  noResult: {
    backgroundColor: defaultColors.bg1,
    color: defaultColors.font7,
    flex: 1,
    textAlign: 'center',
    fontSize: pTd(14),
    paddingTop: pTd(41),
  },
  recentListWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    minHeight: 2,
    minWidth: 2,
  },
  item: {
    height: 20,
  },
  contactWrap: {
    backgroundColor: defaultColors.bg1,
  },
  footer: {
    marginTop: pTd(22),
    width: '100%',
    textAlign: 'center',
    color: defaultColors.font7,
    marginBottom: pTd(100),
  },
});
