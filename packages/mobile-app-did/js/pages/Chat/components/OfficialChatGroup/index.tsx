import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextL, TextM, TextS } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import GroupAvatarShow from '../GroupAvatarShow';
import fonts from 'assets/theme/fonts';
import { useJumpToChatGroupDetails } from 'hooks/chat';
import useGuide, { TGuideInfoRes } from '@portkey-wallet/hooks/hooks-ca/guide';
import { ALREADY_JOINED_GROUP_CODE } from '@portkey-wallet/constants/constants-ca/chat';
import { GuideTypeEnum, JOIN_OFFICIAL_GROUP_ERROR_TIP } from '@portkey-wallet/constants/constants-ca/guide';
import CommonToast from 'components/CommonToast';
import { useJoinGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im';

export default function OfficialChatGroup() {
  // const officialGroupGuideMap
  const officialGroupIdRef = useRef<string>('');
  const jumpToChatGroupDetails = useJumpToChatGroupDetails();
  const [isOfficialGroupMember, setIsOfficialGroupMember] = useState(true);
  const joinGroupChannel = useJoinGroupChannel();

  const { getGuideItem, finishGuideItem } = useGuide();

  const chatInOfficialGroup = useCallback(async () => {
    if (!officialGroupIdRef.current) {
      return CommonToast.fail(JOIN_OFFICIAL_GROUP_ERROR_TIP);
    }
    try {
      await finishGuideItem(GuideTypeEnum.JoinOfficialGroup);
    } catch (error) {
      console.log('===finishGuideItem JoinOfficialGroup error', error);
    }
    try {
      await joinGroupChannel(officialGroupIdRef.current);
      await jumpToChatGroupDetails({ channelUuid: officialGroupIdRef.current });
    } catch (error: any) {
      // already joined
      if (`${error?.code}` === ALREADY_JOINED_GROUP_CODE) {
        await jumpToChatGroupDetails({ channelUuid: officialGroupIdRef.current });
      } else {
        CommonToast.fail(JOIN_OFFICIAL_GROUP_ERROR_TIP);
        console.log('===Failed to join official group error', error);
      }
    }
  }, [finishGuideItem, joinGroupChannel, jumpToChatGroupDetails]);

  const checkIsOfficialMember = useCallback(async () => {
    try {
      const res = await getGuideItem([GuideTypeEnum.JoinOfficialGroup]);
      const target = res?.find((_r: TGuideInfoRes) => _r.guideType === GuideTypeEnum.JoinOfficialGroup);
      let status = true;
      if (target) {
        status = !!target.status;
        officialGroupIdRef.current = target.externalMap?.officialGroupId;
      }
      setIsOfficialGroupMember(status);
    } catch (error) {
      console.log('===Failed to get guide info error', error);
    }
  }, [getGuideItem]);

  useEffect(() => {
    checkIsOfficialMember();
  }, [checkIsOfficialMember]);

  if (isOfficialGroupMember) return null;

  return (
    <View style={styles.containerStyles}>
      <TextM style={[FontStyles.neutralPrimaryTextColor, styles.title]}>Start Chat with</TextM>
      <View style={styles.itemWrap}>
        <View style={styles.itemAvatar}>
          <GroupAvatarShow logoSize={pTd(14)} avatarSize={pTd(48)} svgName="officialGroup2" />
        </View>
        <View style={styles.itemNameWrap}>
          <TextL numberOfLines={1} style={[fonts.mediumFont, FontStyles.font5]}>
            Portkey Official
          </TextL>
          <TextS numberOfLines={1} style={[fonts.regularFont, FontStyles.neutralTertiaryText, styles.subTitle]}>
            Official Group
          </TextS>
        </View>
        <Touchable style={styles.chatButton} onPress={chatInOfficialGroup}>
          <TextS style={[FontStyles.font2, styles.chatText]}>Chat</TextS>
        </Touchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg1,
  },
  title: {
    marginTop: pTd(32),
    marginLeft: pTd(16),
    marginBottom: pTd(8),
  },
  subTitle: {
    marginTop: pTd(2),
  },
  top: {
    ...GStyles.paddingArg(16, 20, 8),
  },
  itemWrap: {
    backgroundColor: defaultColors.bg1,
    height: pTd(72),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...GStyles.paddingArg(0, 16),
  },
  chatButton: {
    backgroundColor: defaultColors.bg5,
    color: defaultColors.font2,
    paddingHorizontal: pTd(12),
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  itemAvatar: {
    marginRight: pTd(12),
  },
  itemNameWrap: {
    flex: 1,
  },
  chatText: {
    lineHeight: pTd(24),
  },
});
