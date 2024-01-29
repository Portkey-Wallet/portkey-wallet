import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GuideTypeEnum,
  JOIN_OFFICIAL_GROUP_TITLE,
  JOIN_OFFICIAL_GROUP_CONTENT,
  JOIN_OFFICIAL_GROUP_ERROR_TIP,
  JOIN_OFFICIAL_GROUP_BUTTON_TITTLE,
} from '@portkey-wallet/constants/constants-ca/guide';
import useGuide, { TGuideInfoRes } from '@portkey-wallet/hooks/hooks-ca/guide';
import { useJoinGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { ALREADY_JOINED_GROUP_CODE } from '@portkey-wallet/constants/constants-ca/chat';
import CommonToast from 'components/CommonToast';
import ActionSheet from 'components/ActionSheet';
import joinGroupBgImage from 'assets/image/pngs/joinGroupBgImage.png';
import { useJumpToChatGroupDetails } from './chat';

export function useJoinOfficialGroupTipModal() {
  const { t } = useTranslation();
  const { getGuideItem, finishGuideItem } = useGuide();
  const officialGroupRef = useRef<string>('');
  const joinGroupChannel = useJoinGroupChannel();
  const jumpToChatGroupDetails = useJumpToChatGroupDetails();

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

  const handleCancel = useCallback(async () => {
    try {
      await finishGuideItem(GuideTypeEnum.CloseJoinOfficialGroup);
    } catch (error) {
      console.log('===finishGuideItem CloseJoinOfficialGroup error', error);
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

  return useCallback(async () => {
    const status = await hasShownJoinOfficialGroupTip();
    console.log('===showJoinOfficialGroupTip', status);
    if (!status) {
      handleCancel();
      ActionSheet.alert({
        isCloseShow: true,
        bgImage: joinGroupBgImage,
        title: JOIN_OFFICIAL_GROUP_TITLE,
        message: JOIN_OFFICIAL_GROUP_CONTENT,
        buttons: [
          {
            title: JOIN_OFFICIAL_GROUP_BUTTON_TITTLE,
            onPress: toJoinOfficialGroup,
          },
        ],
      });
    }
  }, [handleCancel, hasShownJoinOfficialGroupTip, toJoinOfficialGroup]);
}
