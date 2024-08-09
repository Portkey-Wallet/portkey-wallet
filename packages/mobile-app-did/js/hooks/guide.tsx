import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  GuideTypeEnum,
  JOIN_OFFICIAL_GROUP_TITLE,
  JOIN_OFFICIAL_GROUP_CONTENT,
  JOIN_OFFICIAL_GROUP_ERROR_TIP,
  JOIN_OFFICIAL_GROUP_BUTTON_TITTLE,
  AI_CHAT_ADDITION_CONTENT_TIP,
  ADD_AI_CHAT_TITLE,
  AI_CHAT_CONTENT_TIP,
  ADD_AI_CHAT_BUTTON_TITTLE,
  KEY_GENIE_AVATAR_URL,
  ADD_AI_CHAT_ERROR_TIP,
} from '@portkey-wallet/constants/constants-ca/guide';
import useGuide, { TGuideInfoRes } from '@portkey-wallet/hooks/hooks-ca/guide';
import { useJoinGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { ALREADY_JOINED_GROUP_CODE } from '@portkey-wallet/constants/constants-ca/chat';
import CommonToast from 'components/CommonToast';
import ActionSheet from 'components/ActionSheet';
import joinGroupBgImage from 'assets/image/pngs/joinGroupBgImage.png';
import { useJumpToChatDetails, useJumpToChatGroupDetails } from './chat';
import { TextL, TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import CommonAvatar from 'components/CommonAvatar';
import fonts from 'assets/theme/fonts';
import { IKeyGenieInfo } from 'pages/Chat/components/KeyGenieChat';
enum ModalType {
  JoinGroup_And_AiChat,
  JoinGroup,
  AiChat,
  None,
}

export function useJoinOfficialGroupAndAiChatTipModal() {
  const { t } = useTranslation();
  const { getGuideItem, finishGuideItem } = useGuide();
  const officialGroupRef = useRef<string>('');
  const keyGenieInfoRef = useRef<IKeyGenieInfo>();
  const joinGroupChannel = useJoinGroupChannel();
  const jumpToChatGroupDetails = useJumpToChatGroupDetails();
  const jumpToChatDetails = useJumpToChatDetails();

  const hasShownJoinOfficialGroupTip = useCallback(async () => {
    try {
      const res = await getGuideItem([GuideTypeEnum.CloseJoinOfficialGroup]);
      const targetGuide = res?.find(
        (_guide: TGuideInfoRes) => _guide.guideType === GuideTypeEnum.CloseJoinOfficialGroup,
      );
      if (targetGuide) {
        officialGroupRef.current = targetGuide?.externalMap?.officialGroupId;
        return !!targetGuide.status;
      }
      return true;
    } catch (error) {
      console.log('===getGuideItem error', error);
      return true;
    }
  }, [getGuideItem]);
  const hasShownAiChatTip = useCallback(async () => {
    try {
      const res = await getGuideItem([GuideTypeEnum.FinishAiChat]);
      const targetGuide = res?.find((_guide: TGuideInfoRes) => _guide.guideType === GuideTypeEnum.FinishAiChat);
      if (targetGuide) {
        return {
          status: !!targetGuide.status,
          relationId: targetGuide.externalMap?.relationId,
          name: targetGuide.externalMap?.name,
          avatar: targetGuide.externalMap?.avatar,
        };
      }
      return {
        status: true,
      };
    } catch (error) {
      console.log('===getGuideItem error', error);
      return {
        status: true,
      };
    }
  }, [getGuideItem]);

  const handleCancel = useCallback(async () => {
    try {
      await finishGuideItem(GuideTypeEnum.CloseJoinOfficialGroup);
    } catch (error) {
      console.log('===finishGuideItem CloseJoinOfficialGroup error', error);
    }
  }, [finishGuideItem]);
  const handleCancelAiChat = useCallback(async () => {
    try {
      await finishGuideItem(GuideTypeEnum.FinishAiChat);
    } catch (error) {
      console.log('===finishGuideItem CloseAiChat error', error);
    }
  }, [finishGuideItem]);

  const toJoinOfficialGroup = useCallback(async () => {
    if (!officialGroupRef.current) {
      return CommonToast.fail(JOIN_OFFICIAL_GROUP_ERROR_TIP);
    }
    try {
      await finishGuideItem(GuideTypeEnum.JoinOfficialGroup);
    } catch (error) {
      console.log('===finishGuideItem JoinOfficialGroup error', error);
    }
    try {
      await joinGroupChannel(officialGroupRef.current);
    } catch (error: any) {
      // already joined
      if (`${error?.code}` === ALREADY_JOINED_GROUP_CODE) {
        jumpToChatGroupDetails({ channelUuid: officialGroupRef.current });
      } else {
        CommonToast.fail(JOIN_OFFICIAL_GROUP_ERROR_TIP);
        console.log('===Failed to join error', error);
      }
    }
  }, [finishGuideItem, joinGroupChannel, jumpToChatGroupDetails]);
  const chatToKeyGenie = useCallback(async () => {
    if (!keyGenieInfoRef.current) {
      return CommonToast.fail(ADD_AI_CHAT_ERROR_TIP);
    }
    try {
      await finishGuideItem(GuideTypeEnum.AiChat);
    } catch (error) {
      console.log('===finishGuideItem AiChat error', error);
    }
    try {
      // await joinGroupChannel(officialGroupIdRef.current);
      // const { channelUuid } = await createChannel(relationIdRef.current || 'e7i7y-giaaa-aaaaj-2ooma-cai');
      await jumpToChatDetails({ toRelationId: keyGenieInfoRef.current?.relationId });
    } catch (error: any) {
      // already joined
      CommonToast.fail(ADD_AI_CHAT_ERROR_TIP);
      console.log('===Failed to chat Ai error', error);
    }
  }, [finishGuideItem, jumpToChatDetails]);
  return useCallback(async () => {
    const status = await hasShownJoinOfficialGroupTip();
    const aiChatStatus = await hasShownAiChatTip();
    keyGenieInfoRef.current = {
      relationId: aiChatStatus?.relationId,
      name: aiChatStatus?.name,
      avatar: aiChatStatus?.avatar,
    };
    console.log('===showJoinOfficialGroupTip', status);
    console.log('===aiChatStatus', aiChatStatus?.status);
    const type =
      !status && !aiChatStatus?.status
        ? ModalType.JoinGroup_And_AiChat
        : !status
        ? ModalType.JoinGroup
        : !aiChatStatus?.status
        ? ModalType.AiChat
        : ModalType.None;
    console.log('===type', type);
    if (type === ModalType.JoinGroup || type === ModalType.JoinGroup_And_AiChat) {
      handleCancel();
      if (type === ModalType.JoinGroup_And_AiChat) {
        handleCancelAiChat();
      }
      ActionSheet.alert({
        isCloseShow: true,
        bgImage: joinGroupBgImage,
        title: JOIN_OFFICIAL_GROUP_TITLE,
        message:
          JOIN_OFFICIAL_GROUP_CONTENT + (type === ModalType.JoinGroup_And_AiChat ? AI_CHAT_ADDITION_CONTENT_TIP : ''),
        buttons: [
          {
            title: JOIN_OFFICIAL_GROUP_BUTTON_TITTLE,
            onPress: toJoinOfficialGroup,
          },
        ],
      });
    } else if (type === ModalType.AiChat) {
      handleCancelAiChat();
      ActionSheet.alert({
        title: ADD_AI_CHAT_TITLE,
        isCloseShow: true,
        message: AI_CHAT_CONTENT_TIP,
        message2: (
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <CommonAvatar imageUrl={aiChatStatus?.avatar || KEY_GENIE_AVATAR_URL} resizeMode="cover" />
              <View style={styles.textContainer}>
                <TextL style={[fonts.mediumFont, styles.title]}>{t(aiChatStatus?.name || 'KeyGenie')}</TextL>
                <TextS style={[fonts.regularFont, styles.subtitle]}>{t('AI Chat - New Chat Experience')}</TextS>
              </View>
            </View>
          </View>
        ),
        buttons: [
          {
            title: ADD_AI_CHAT_BUTTON_TITTLE,
            onPress: chatToKeyGenie,
          },
        ],
      });
    }
  }, [
    chatToKeyGenie,
    handleCancel,
    handleCancelAiChat,
    hasShownAiChatTip,
    hasShownJoinOfficialGroupTip,
    t,
    toJoinOfficialGroup,
  ]);
}
const styles = StyleSheet.create({
  outerContainer: {
    padding: pTd(12),
    backgroundColor: defaultColors.neutralContainerBG,
    borderRadius: pTd(6),
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    flex: 1,
    height: pTd(48),
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    marginLeft: pTd(16),
  },
  title: {
    lineHeight: pTd(24),
  },
  subtitle: {
    color: defaultColors.neutralTertiaryText,
    lineHeight: pTd(16),
  },
});
