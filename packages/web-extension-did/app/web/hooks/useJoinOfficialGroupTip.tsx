// import CustomSvg from 'components/CustomSvg';
import CustomModal from 'pages/components/CustomModal';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigateState } from './router';
import singleMessage from 'utils/singleMessage';
import {
  GuideTypeEnum,
  JoinOfficialGroupContent,
  JoinOfficialGroupErrorTip,
  JoinOfficialGroupTitle,
} from '@portkey-wallet/constants/constants-ca/guide';
import useGuide from '@portkey-wallet/hooks/hooks-ca/guide';
import { useJoinGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { ALREADY_JOINED_GROUP_CODE } from '@portkey-wallet/constants/constants-ca/chat';

export function useJoinOfficialGroupTipModal() {
  const { t } = useTranslation();
  const navigate = useNavigateState();
  const { getGuideItem, finishGuideItem } = useGuide();
  const officialGroupRef = useRef<string>('');
  const joinGroupChannel = useJoinGroupChannel();

  const showJoinOfficialGroupTip = useCallback(async () => {
    try {
      const { guildList } = await getGuideItem([GuideTypeEnum.JoinOfficialGroup]);
      const targetGuide = guildList?.find((_guide: any) => _guide.guideType === GuideTypeEnum.JoinOfficialGroup);
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
    try {
      await finishGuideItem(GuideTypeEnum.JoinOfficialGroup);
    } catch (error) {
      console.log('===finishGuideItem JoinOfficialGroup error', error);
    }
    if (!officialGroupRef.current) {
      return singleMessage.error(JoinOfficialGroupErrorTip);
    }
    try {
      await joinGroupChannel(officialGroupRef.current);
      navigate(`/chat-box-group/${officialGroupRef.current}`);
    } catch (error: any) {
      // already joined
      if (`${error?.code}` === ALREADY_JOINED_GROUP_CODE) {
        navigate(`/chat-box-group/${officialGroupRef.current}`);
      } else {
        singleMessage.error(JoinOfficialGroupErrorTip);
        console.log('Failed to join error', error);
      }
    }
  }, [finishGuideItem, joinGroupChannel, navigate]);

  return useCallback(async () => {
    const showStatus = await showJoinOfficialGroupTip();
    if (!showStatus) {
      handleCancel();
      CustomModal({
        className: 'join-official-group-tip-modal',
        type: 'confirm',
        content: (
          <div className="join-official-group-tip-modal-container">
            {/* <CustomSvg type="AddCircle" /> */}
            <div className="modal-title">{JoinOfficialGroupTitle}</div>
            <div className="modal-content flex-column">{JoinOfficialGroupContent}</div>
          </div>
        ),
        cancelText: t('Cancel'),
        okText: t('Join Portkey Official'),
        onOk: toJoinOfficialGroup,
        onCancel: handleCancel,
      });
    }
  }, [handleCancel, showJoinOfficialGroupTip, t, toJoinOfficialGroup]);
}
