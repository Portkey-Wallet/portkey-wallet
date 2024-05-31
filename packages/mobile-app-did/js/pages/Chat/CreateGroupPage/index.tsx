import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { useChatContactFlatList, useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { TextM } from 'components/CommonText';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { pTd } from 'utils/unit';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import GroupMemberItem from '../components/GroupMemberItem';
import NoData from 'components/NoData';
import { useCreateGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im/channelList';
import { sleep } from '@portkey-wallet/utils';
import { useJumpToChatGroupDetails } from 'hooks/chat';
import ImageWithUploadFunc, { ImageWithUploadFuncInstance } from 'components/ImageWithUploadFunc';

const ChatGroupDetails = () => {
  const uploadRef = useRef<ImageWithUploadFuncInstance>(null);

  const createChannel = useCreateGroupChannel();
  const jumpToChatGroupDetails = useJumpToChatGroupDetails();

  const [groupName, setGroupName] = useState('');

  const [keyword, setKeyword] = useState('');
  const allChatList = useChatContactFlatList();
  const searchContact = useLocalContactSearch();

  const [filterChatContactList, setFilterChatContactList] = useState<ContactItemType[]>([]);
  const [selectedContactMap, setSelectedContactMap] = useState<{ [key: string]: string }>({});

  const selectedCount = useMemo((): number => Object.keys(selectedContactMap).length, [selectedContactMap]);
  const totalCount = useMemo((): number => allChatList.length, [allChatList]);
  const isButtonDisable = useMemo(() => !groupName || selectedCount === 0, [groupName, selectedCount]);

  const onPressConfirm = useCallback(async () => {
    try {
      Loading.show();
      await sleep(500); // adjust large size photo on android

      const selectedContactList = Object.keys(selectedContactMap);
      const s3Url = await uploadRef.current?.uploadPhoto();
      const result = await createChannel(groupName.trim(), selectedContactList, s3Url);
      await sleep(100);
      CommonToast.success('Group created');

      jumpToChatGroupDetails({ channelUuid: result.channelUuid });
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [createChannel, groupName, jumpToChatGroupDetails, selectedContactMap]);

  const onPressItem = useCallback((id: string) => {
    setSelectedContactMap(prevMap => {
      if (prevMap[id]) {
        const updatedMap = { ...prevMap };
        delete updatedMap[id];
        return updatedMap;
      } else {
        return { ...prevMap, [id]: id };
      }
    });
  }, []);

  useEffect(() => {
    if (keyword.trim()) {
      const { contactFilterList } = searchContact(keyword.trim(), ContactsTab.Chats);
      setFilterChatContactList(contactFilterList || []);
    } else {
      setFilterChatContactList(allChatList);
    }
  }, [allChatList, keyword, searchContact]);

  return (
    <PageContainer
      titleDom="Create Group"
      hideTouchable
      safeAreaColor={['white', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={[GStyles.flexRow, GStyles.itemCenter, styles.groupNameWrap]}>
        <ImageWithUploadFunc title={groupName} ref={uploadRef} />
        <CommonInput
          type="general"
          theme="white-bg"
          placeholder="Group Name"
          maxLength={40}
          value={groupName}
          onChangeText={setGroupName}
          inputStyle={styles.nameInputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          errorStyle={styles.nameInputErrorStyle}
          containerStyle={styles.nameInputContainerStyle}
        />
      </View>
      <View style={[BGStyles.bg1, GStyles.flex1]}>
        <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.selectHeaderWrap]}>
          <TextM style={FontStyles.font3}>Select Contacts</TextM>
          <TextM style={FontStyles.font3}>{`${selectedCount}/${totalCount}`}</TextM>
        </View>
        <View style={styles.inputWrap}>
          <CommonInput allowClear type="search" value={keyword} onChangeText={setKeyword} placeholder="Search" />
        </View>
        <FlatList
          keyExtractor={(item: ContactItemType) => item.id}
          data={filterChatContactList}
          ListEmptyComponent={<NoData noPic message={keyword ? 'No search found' : 'No contact'} />}
          renderItem={({ item }: { item: ContactItemType }) => (
            <GroupMemberItem
              selected={!!selectedContactMap[item.imInfo?.relationId || '']}
              item={{
                title: item.name || item.caHolderInfo?.walletName || item.imInfo?.name || '',
                relationId: item.imInfo?.relationId || '',
                avatar: item.avatar || '',
              }}
              onPress={onPressItem}
            />
          )}
        />
      </View>
      <View style={styles.buttonWrap}>
        <CommonButton disabled={isButtonDisable} type="primary" title="Done" onPress={onPressConfirm} />
      </View>
    </PageContainer>
  );
};

export default ChatGroupDetails;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  groupNameWrap: {
    height: pTd(72),
    paddingHorizontal: pTd(16),
    marginHorizontal: pTd(20),
    marginVertical: pTd(24),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
  },
  selectHeaderWrap: {
    marginTop: pTd(16),
    marginHorizontal: pTd(20),
  },
  inputWrap: {
    paddingTop: pTd(12),
    paddingBottom: pTd(8),
    paddingHorizontal: pTd(20),
  },
  buttonWrap: {
    ...GStyles.paddingArg(10, 20, 16),
    backgroundColor: defaultColors.bg1,
  },
  nameInputStyle: {
    fontSize: pTd(16),
  },
  nameInputContainerStyle: {
    flex: 1,
  },
  nameInputErrorStyle: {
    height: 0,
    padding: 0,
    margin: 0,
  },
  inputContainerStyle: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
});
