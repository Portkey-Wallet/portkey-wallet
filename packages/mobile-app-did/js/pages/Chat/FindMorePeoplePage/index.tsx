import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import CommonInput from 'components/CommonInput';
import useDebounce from 'hooks/useDebounce';
import { BGStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import ContactItem from 'components/ContactItem';
import im from '@portkey-wallet/im';
import CommonToast from 'components/CommonToast';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useCaAddressInfoList, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getAelfAddress } from '@portkey-wallet/utils/aelf';
import { GetOtherUserInfoDefaultResult } from '@portkey-wallet/im/types/service';
import navigationService from 'utils/navigationService';
import { useJumpToChatDetails } from 'hooks/chat';
import { useCheckIsStranger } from '@portkey-wallet/hooks/hooks-ca/im';
import NoData from 'components/NoData';
import Lottie from 'lottie-react-native';
import Touchable from 'components/Touchable';
import { copyText } from 'utils';

const FindMorePeople = () => {
  const { userId } = useWallet();
  const navToChatDetails = useJumpToChatDetails();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceWord = useDebounce(getAelfAddress(keyword.trim()), 500);
  const checkIsStranger = useCheckIsStranger();

  const [list, setList] = useState<GetOtherUserInfoDefaultResult[]>([]);
  const caAddressInfoList = useCaAddressInfoList();

  const checkIsMyself = useCallback(() => {
    if (debounceWord === userId) return true;
    if (
      caAddressInfoList.find(
        ele => debounceWord === `ELF_${ele.caAddress}_${ele.chainId}` || debounceWord === ele.caAddress,
      )
    )
      return true;
    return false;
  }, [caAddressInfoList, debounceWord, userId]);

  const searchUser = useLockCallback(async () => {
    if (!debounceWord) return setList([]);

    if (checkIsMyself()) return CommonToast.fail('Unable to add yourself as a contact');

    try {
      setLoading(true);
      const { data } = await im.service.getUserInfo<GetOtherUserInfoDefaultResult>({
        address: debounceWord,
        fields: ['ADDRESS_WITH_CHAIN'],
      });
      setList([{ ...data }]);
      console.log('more people', data);
    } catch (error) {
      setList([]);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [debounceWord]);

  const IptRightIcon = useMemo(() => {
    if (loading)
      return <Lottie style={styles.loadingIcon} source={require('assets/lottieFiles/loading.json')} autoPlay loop />;

    return keyword ? (
      <TouchableOpacity onPress={() => setKeyword('')}>
        <Svg icon="clear3" size={pTd(16)} />
      </TouchableOpacity>
    ) : undefined;
  }, [loading, keyword]);

  useEffect(() => {
    searchUser();
  }, [debounceWord, searchUser]);

  const renderItem = useCallback(
    ({ item }: { item: GetOtherUserInfoDefaultResult }) => {
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
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={[BGStyles.bg5, GStyles.paddingArg(8, 20, 8)]}>
        <CommonInput
          loading={loading}
          allowClear
          value={keyword}
          placeholder="Address/Portkey ID"
          onChangeText={setKeyword}
          rightIcon={IptRightIcon}
          rightIconContainerStyle={styles.rightIconContainerStyle}
        />
      </View>
      {!keyword && (
        <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemEnd, styles.portkeyIdWrap]}>
          <View>
            <TextM style={styles.portkeyId}>{`My Portkey ID : `}</TextM>
            <TextM style={styles.portkeyId}>{userId}</TextM>
          </View>
          <Touchable onPress={() => copyText(userId || '')}>
            <Svg icon="copy" size={pTd(16)} />
          </Touchable>
          <Touchable onPress={() => navigationService.navigate('ChatQrCode')}>
            <Svg icon="chat-scan" size={pTd(16)} />
          </Touchable>
        </View>
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
