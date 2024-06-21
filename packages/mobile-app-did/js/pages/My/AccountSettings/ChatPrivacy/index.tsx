import React, { useCallback, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, FlatList } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import CommonToast from 'components/CommonToast';
import { IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import PrivacyItem from './components/PrivacyItem';
import { useFocusEffect } from '@react-navigation/native';
import { sleep } from '@portkey-wallet/utils';
import { useContactPrivacyList } from '@portkey-wallet/hooks/hooks-ca/security';
import NoData from 'components/NoData';
import { BGStyles } from 'assets/theme/styles';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

const ChatPrivacy: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { list, refresh } = useContactPrivacyList();

  const getList = useLockCallback(
    async (isInit = false) => {
      if (isInit) await sleep(100);
      setIsRefreshing(true);
      try {
        await refresh();
      } catch (error) {
        CommonToast.failError(`Loading failed. Please retry.`);
      }
      setIsRefreshing(false);
    },
    [refresh],
  );
  const getListRef = useRef(getList);
  getListRef.current = getList;

  useFocusEffect(
    useCallback(() => {
      console.log('init list');
      getListRef.current(true);
    }, []),
  );

  const renderItem = useCallback(({ item }: { item: IContactPrivacy }) => {
    return (
      <PrivacyItem
        item={item}
        onPress={() => {
          navigationService.navigate('EditChatPrivacy', {
            detail: item,
          });
        }}
      />
    );
  }, []);

  return (
    <PageContainer
      titleDom={'Privacy'}
      safeAreaColor={['white', 'gray']}
      containerStyles={pageStyles.pageWrap}
      hideTouchable={true}
      scrollViewProps={{ disabled: true }}>
      <FlatList
        style={pageStyles.listWrap}
        refreshing={isRefreshing}
        data={list || []}
        keyExtractor={(_item: IContactPrivacy, index: number) => `${index}`}
        renderItem={renderItem}
        onRefresh={getList}
        ListEmptyComponent={<NoData message={'No Login Account'} topDistance={pTd(160)} style={BGStyles.bg4} />}
      />
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg4,
    paddingHorizontal: 0,
  },
  listWrap: {
    ...GStyles.paddingArg(24, 20, 18),
  },
  tipsWrap: {
    lineHeight: pTd(20),
    marginBottom: pTd(24),
  },
});

export default ChatPrivacy;
