import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import { BGStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import ContactItem from 'components/ContactItem';
import im from '@portkey-wallet/im';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { getAelfAddress } from '@portkey-wallet/utils/aelf';
import { GetUserInfoDefaultResult } from '@portkey-wallet/im/types/service';
import navigationService from 'utils/navigationService';
import { useJumpToChatDetails } from 'hooks/chat';
import { useCheckIsStranger } from '@portkey-wallet/hooks/hooks-ca/im';
import NoData from 'components/NoData';
import Lottie from 'lottie-react-native';
import Touchable from 'components/Touchable';
import { useInputFocus } from 'hooks/useInputFocus';
import CommonToast from 'components/CommonToast';
import InviteFriendsSection from '../components/InviteFriendsSection';
import OfficialChatGroup from '../components/OfficialChatGroup';
import KeyGenieChat from '../components/KeyGenieChat';
import { hideReferral } from '@portkey-wallet/constants/referral';

const FindMorePeople = () => {
  const iptRef = useRef<TextInput>(null);
  useInputFocus(iptRef);
  const navToChatDetails = useJumpToChatDetails();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceWord = useDebounce(getAelfAddress(keyword.trim()), 500);
  const checkIsStranger = useCheckIsStranger();

  const [list, setList] = useState<GetUserInfoDefaultResult[]>([]);

  const searchUser = useLockCallback(async () => {
    if (!debounceWord) return setList([]);

    try {
      setLoading(true);
      const { data } = await im.service.getUserInfoList<GetUserInfoDefaultResult>({
        keywords: debounceWord,
        fields: [],
      });
      setList(data);
      console.log('more people', data);
    } catch (error) {
      setList([]);
      CommonToast.failError(error);
    } finally {
      setLoading(false);
    }
  }, [debounceWord]);

  const IptRightIcon = useMemo(() => {
    if (loading)
      return <Lottie style={styles.loadingIcon} source={require('assets/lottieFiles/loading.json')} autoPlay loop />;

    return keyword ? (
      <Touchable onPress={() => setKeyword('')}>
        <Svg icon="clear3" size={pTd(16)} />
      </Touchable>
    ) : undefined;
  }, [loading, keyword]);

  useEffect(() => {
    searchUser();
  }, [debounceWord, searchUser]);

  const renderItem = useCallback(
    ({ item }: { item: GetUserInfoDefaultResult }) => {
      return (
        <ContactItem
          isShowChat
          isShowContactIcon={!checkIsStranger(item.relationId || '')}
          onPressChat={() => navToChatDetails({ toRelationId: item.relationId })}
          onPress={() =>
            navigationService.navigate('ChatContactProfile', { contact: item, relationId: item.relationId })
          }
          contact={{
            ...item,
            index: '',
            modificationTime: 0,
            isImputation: false,
            id: '',
            addresses: [],
            isDeleted: false,
            userId: '',
          }}
        />
      );
    },
    [checkIsStranger, navToChatDetails],
  );

  return (
    <PageContainer
      titleDom={'Find People'}
      safeAreaColor={['white', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={[BGStyles.bg1, GStyles.paddingArg(0, 20, 8)]}>
        <CommonInput
          grayBorder
          ref={iptRef}
          theme="white-bg"
          loading={loading}
          allowClear
          value={keyword}
          placeholder="Address/email"
          onChangeText={setKeyword}
          rightIcon={IptRightIcon}
          rightIconContainerStyle={styles.rightIconContainerStyle}
        />
      </View>
      {!debounceWord && (
        <>
          {!hideReferral && <InviteFriendsSection />}
          <OfficialChatGroup />
          <KeyGenieChat />
        </>
      )}
      <FlatList
        data={list}
        keyExtractor={item => item.relationId}
        renderItem={renderItem}
        ListEmptyComponent={debounceWord && !loading ? <NoData noPic message="No search result" /> : null}
      />
    </PageContainer>
  );
};

export default FindMorePeople;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg1,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  svgWrap: {
    padding: pTd(16),
  },
  portkeyIdWrap: {
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: pTd(20),
    paddingVertical: pTd(16),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  loadingIcon: {
    width: pTd(20),
  },
});
