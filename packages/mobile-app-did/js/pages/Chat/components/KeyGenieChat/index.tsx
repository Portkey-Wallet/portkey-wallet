import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextL, TextS } from 'components/CommonText';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import fonts from 'assets/theme/fonts';
import { useJumpToChatDetails } from 'hooks/chat';
import useGuide, { TGuideInfoRes } from '@portkey-wallet/hooks/hooks-ca/guide';
import {
  ADD_AI_CHAT_ERROR_TIP,
  GuideTypeEnum,
  KEY_GENIE_AVATAR_URL,
  KEY_GENIE_GREETINGS,
  KEY_GENIE_NAME,
} from '@portkey-wallet/constants/constants-ca/guide';
import CommonToast from 'components/CommonToast';
// import { useCreateP2pChannel, useJoinGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import CommonAvatar from 'components/CommonAvatar';
import { useLanguage } from 'i18n/hooks';
import AIChatMark from '../AIChatMark';
export interface IKeyGenieInfo {
  relationId: string;
  name: string;
  avatar: string;
}
export default function KeyGenieChat() {
  const { t } = useLanguage();
  const keyGenieInfoRef = useRef<IKeyGenieInfo>();
  const jumpToChatDetails = useJumpToChatDetails();
  // const jumpToChatGroupDetails = useJumpToChatGroupDetails();
  const [isChatToKeyGenie, setIsChatToKeyGenie] = useState(true);
  // const createChannel = useCreateP2pChannel();

  const { getGuideItem, finishGuideItem } = useGuide();

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

  const checkIsChatToKeyGenie = useCallback(async () => {
    try {
      const res = await getGuideItem([GuideTypeEnum.AiChat]);
      const target = res?.find((_r: TGuideInfoRes) => _r.guideType === GuideTypeEnum.AiChat);
      let status = true;
      if (target) {
        status = !!target.status;
        keyGenieInfoRef.current = {
          relationId: target.externalMap?.relationId,
          name: target.externalMap?.name,
          avatar: target.externalMap?.avatar,
        };
      }
      console.log('wfs===checkIsChatToKeyGenie', 'status', status, 'res', JSON.stringify(res));
      setIsChatToKeyGenie(status);
    } catch (error) {
      console.log('===Failed to get guide info error', error);
    }
  }, [getGuideItem]);

  useEffect(() => {
    checkIsChatToKeyGenie();
  }, [checkIsChatToKeyGenie]);
  console.log('isChatToKeyGenie', isChatToKeyGenie);
  if (isChatToKeyGenie) return null;

  return (
    <View style={styles.itemWrap}>
      <View style={styles.itemAvatar}>
        <CommonAvatar
          avatarSize={pTd(48)}
          imageUrl={keyGenieInfoRef.current?.avatar || KEY_GENIE_AVATAR_URL}
          resizeMode="cover"
        />
      </View>
      <View style={styles.itemNameWrap}>
        <View style={styles.itemTitleWrap}>
          <TextL numberOfLines={1} style={[fonts.mediumFont, FontStyles.font5]}>
            {t(keyGenieInfoRef.current?.name || KEY_GENIE_NAME)}
          </TextL>
          <AIChatMark />
        </View>
        <TextS numberOfLines={1} style={[fonts.regularFont, FontStyles.neutralTertiaryText, styles.subTitle]}>
          {t(KEY_GENIE_GREETINGS)}
        </TextS>
      </View>
      <Touchable style={styles.chatButton} onPress={chatToKeyGenie}>
        <TextS style={[FontStyles.font2, styles.chatText]}>{t('Chat')}</TextS>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg1,
  },
  title: {
    marginTop: pTd(32),
    marginLeft: pTd(20),
    marginBottom: pTd(8),
  },
  itemTitleWrap: {
    flexDirection: 'row',
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
    marginTop: pTd(8),
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
