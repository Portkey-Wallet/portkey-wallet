import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import { TextL, TextM, TextS, TextXXXL } from 'components/CommonText';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import CommonAvatar from 'components/CommonAvatar';
import { FontStyles } from 'assets/theme/styles';
import ActionSheet from 'components/ActionSheet';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import Touchable from 'components/Touchable';
import GroupInfoMemberItem, { GroupInfoMemberItemType } from '../components/GroupInfoMemberItem';
import { useCurrentChannelId } from '../context/hooks';
import { useGroupChannelInfo, useLeaveChannel, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { GROUP_INFO_MEMBER_SHOW_LIMITED } from '@portkey-wallet/constants/constants-ca/chat';

const GroupInfoPage = () => {
  const myRelationId = useRelationId();

  const currentChannelId = useCurrentChannelId();
  const { groupInfo, isAdmin } = useGroupChannelInfo(currentChannelId || '', true);
  const { members } = groupInfo || {};

  const leaveGroup = useLeaveChannel();

  const membersShowList = useMemo(() => {
    return members?.length && members?.length >= GROUP_INFO_MEMBER_SHOW_LIMITED
      ? members?.slice(0, GROUP_INFO_MEMBER_SHOW_LIMITED)
      : members;
  }, [members]);

  const isShowViewMoreButton = useMemo(() => {
    return members?.length && members?.length > GROUP_INFO_MEMBER_SHOW_LIMITED;
  }, [members?.length]);

  const disableRemoveButton = useMemo(() => {
    return !!(members?.length && members?.length === 1);
  }, [members?.length]);

  const onLeave = useCallback(() => {
    return ActionSheet.alert({
      title: 'Are you sure to leave this group?',
      buttons: [
        {
          title: 'No',
          type: 'outline',
        },
        {
          title: 'Yes',
          onPress: async () => {
            try {
              Loading.show();
              await leaveGroup(currentChannelId || '');
              navigationService.goBack();
            } catch (error) {
              CommonToast.failError(error);
            } finally {
              Loading.hide();
            }
          },
        },
      ],
    });
  }, [currentChannelId, leaveGroup]);

  const onPressItem = useCallback(
    (item: GroupInfoMemberItemType) => {
      if (myRelationId === item.relationId) {
        navigationService.navigate('WalletName');
      } else {
        navigationService.navigate('ChatContactProfile', {
          relationId: item.relationId,
        });
      }
    },
    [myRelationId],
  );

  return (
    <PageContainer
      hideTouchable
      titleDom="Group Info"
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <ScrollView>
        <View style={[GStyles.center, styles.headerWrap]}>
          <CommonAvatar avatarSize={pTd(80)} svgName="chat-group-avatar" />
          <TextXXXL numberOfLines={1} style={[GStyles.marginTop(pTd(8)), GStyles.paddingArg(0, pTd(20))]}>
            {groupInfo?.name}
          </TextXXXL>
          <TextM style={[GStyles.marginTop(pTd(4)), FontStyles.font7]}>{`${groupInfo?.members.length} member${
            groupInfo?.members.length && groupInfo?.members.length > 1 ? 's' : ''
          }`}</TextM>
        </View>

        <View style={styles.centerSection}>
          <Touchable
            style={[GStyles.flexRow, GStyles.itemCenter, styles.membersActionWrap]}
            onPress={() => navigationService.navigate('AddMembersPage')}>
            <Svg icon="chat-add-member" size={pTd(20)} />
            <TextL style={[FontStyles.font4, styles.actionText]}>Add Members</TextL>
          </Touchable>
          {isAdmin && (
            <Touchable
              disabled={disableRemoveButton}
              style={[GStyles.flexRow, GStyles.itemCenter, styles.membersActionWrap]}
              onPress={() => navigationService.navigate('RemoveMembersPage')}>
              <Svg icon="chat-remove-member" size={pTd(20)} color={disableRemoveButton ? defaultColors.bg16 : ''} />
              <TextL style={[FontStyles.font13, styles.actionText, disableRemoveButton && styles.disabled]}>
                Remove Members
              </TextL>
            </Touchable>
          )}

          {membersShowList &&
            membersShowList.map((item, index) => (
              <GroupInfoMemberItem
                key={index}
                isOwner={item.isAdmin}
                item={{ relationId: item.relationId, title: item.name }}
                onPress={onPressItem}
                style={index === membersShowList.length - 1 && !isShowViewMoreButton ? styles.noBorderBottom : {}}
              />
            ))}
          {isShowViewMoreButton && (
            <Touchable
              style={[GStyles.flexRow, GStyles.center, styles.viewMore]}
              onPress={() => navigationService.navigate('GroupMembersPage')}>
              <TextS style={[FontStyles.font3, GStyles.marginRight(pTd(8))]}>View more members</TextS>
              <Svg icon="right-arrow" color={defaultColors.font3} size={pTd(16)} />
            </Touchable>
          )}
        </View>
        {isAdmin && (
          <Touchable
            style={[GStyles.flexRow, GStyles.itemCenter, GStyles.spaceBetween, styles.transferOwnerShip]}
            onPress={() => navigationService.navigate('TransferOwnershipPage')}>
            <TextL>Transfer Group Ownership</TextL>
            <Svg icon="right-arrow" color={defaultColors.font3} size={pTd(16)} />
          </Touchable>
        )}
      </ScrollView>

      <View style={styles.buttonWrap}>
        {isAdmin ? (
          <CommonButton type="primary" title={'Edit'} onPress={() => navigationService.navigate('EditGroupPage')} />
        ) : (
          <CommonButton
            type="outline"
            onPress={onLeave}
            title={'Leave Group'}
            buttonStyle={styles.leaveButtonStyle}
            titleStyle={styles.leaveTitleStyle}
          />
        )}
      </View>
    </PageContainer>
  );
};

export default GroupInfoPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  headerWrap: {
    marginTop: pTd(24),
  },
  centerSection: {
    marginTop: pTd(24),
    borderRadius: pTd(6),
    paddingHorizontal: pTd(16),
    marginHorizontal: pTd(20),
    backgroundColor: defaultColors.bg1,
  },
  membersActionWrap: {
    paddingLeft: pTd(8),
    height: pTd(48),
    borderBottomColor: defaultColors.border1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: StyleSheet.hairlineWidth,
  },
  actionText: {
    marginLeft: pTd(14),
    width: pTd(192),
  },

  viewMore: {
    height: pTd(40),
  },
  transferOwnerShip: {
    height: pTd(56),
    paddingHorizontal: pTd(16),
    marginTop: pTd(16),
    marginHorizontal: pTd(20),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
  },
  buttonWrap: {
    ...GStyles.marginArg(10, 20, 16),
  },
  leaveButtonStyle: {
    borderColor: defaultColors.border7,
    borderWidth: pTd(1),
    marginBottom: pTd(1),
  },
  leaveTitleStyle: {
    color: defaultColors.font12,
  },
  disabled: {
    color: defaultColors.bg16,
  },
  noBorderBottom: {
    borderBottomWidth: 0,
  },
});
