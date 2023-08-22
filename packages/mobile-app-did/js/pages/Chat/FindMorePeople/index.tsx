import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import CommonInput from 'components/CommonInput';
import Touchable from 'components/Touchable';
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
import { useContactList } from '@portkey-wallet/hooks/hooks-ca/contact';
import navigationService from 'utils/navigationService';

const FindMorePeople = () => {
  const { userId } = useWallet();
  const contactList = useContactList();

  console.log('contactList', contactList);

  const [keyword, setKeyword] = useState('');
  // const [, setLoading] = useState(false);
  const debounceWord = useDebounce(keyword, 500);

  const [list, setList] = useState<GetOtherUserInfoDefaultResult[]>([]);
  const caAddressInfoList = useCaAddressInfoList();

  const isMyContact = useMemo(() => {
    return false;
    // return contactList.includes(ele => ele?.imInfo?.relationId === list[0].relationId);
  }, []);

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
    if (!debounceWord) return;
    if (checkIsMyself()) return CommonToast.fail('Unable to add yourself as a contact');

    try {
      const { data } = await im.service.getUserInfo<GetOtherUserInfoDefaultResult>({
        address: debounceWord,
        fields: ['ADDRESS_WITH_CHAIN'],
      });
      setList([{ ...data }]);
    } catch (error) {
      console.log(error);
    }
  }, [debounceWord]);

  const onChangeText = useCallback((v: string) => {
    const address = getAelfAddress(v.trim());
    setKeyword(address);
  }, []);

  useEffect(() => {
    searchUser();
  }, [debounceWord, searchUser]);

  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <ContactItem
          isShowChat
          isShowContactIcon={isMyContact}
          isShowWarning={item.isImputation}
          onPressChat={() => navigationService.navigate('ChatDetails', { channelInfo: item })}
          onPress={() => navigationService.navigate('ChatContactProfile', { contact: item })}
          contact={item}
        />
      );
    },
    [isMyContact],
  );

  return (
    <PageContainer
      titleDom={'Find More'}
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={[BGStyles.bg5, GStyles.paddingArg(8, 20, 8)]}>
        <CommonInput
          value={keyword}
          onChangeText={onChangeText}
          rightIcon={
            keyword ? (
              <Touchable onPress={() => setKeyword('')}>
                <Svg icon="clear3" size={pTd(16)} />
              </Touchable>
            ) : undefined
          }
          rightIconContainerStyle={styles.rightIconContainerStyle}
        />
      </View>
      {!keyword && (
        <View style={[GStyles.center, styles.portkeyIdWrap]}>
          <TextM style={styles.portkeyId} numberOfLines={1}>{`My Portkey ID : ${userId}`}</TextM>
        </View>
      )}
      <FlatList data={list} renderItem={renderItem} />
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
  buttonGroupWrap: {},
  portkeyIdWrap: {
    textAlign: 'center',
    height: pTd(46),
    lineHeight: pTd(46),
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  portkeyId: {
    width: pTd(300),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
});
