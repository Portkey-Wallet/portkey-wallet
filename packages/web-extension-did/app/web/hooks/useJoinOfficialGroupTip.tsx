import CustomSvg from 'components/CustomSvg';
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
import useGuide, { TGuideInfoRes } from '@portkey-wallet/hooks/hooks-ca/guide';
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
      return singleMessage.error(JoinOfficialGroupErrorTip);
    }
    try {
      await finishGuideItem(GuideTypeEnum.JoinOfficialGroup);
    } catch (error) {
      console.log('===finishGuideItem JoinOfficialGroup error', error);
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
        console.log('===Failed to join error', error);
      }
    }
  }, [finishGuideItem, joinGroupChannel, navigate]);

  return useCallback(async () => {
    const status = await showJoinOfficialGroupTip();
    if (!status) {
      handleCancel();
      const modal = CustomModal({
        className: 'join-official-group-tip-modal',
        type: 'info',
        content: (
          <div className="join-official-group-tip-modal-container">
            <CustomSvg
              type="CloseNew"
              onClick={() => {
                modal.destroy();
                handleCancel();
              }}
            />
            <div className="flex-center join-official-group-icon">
              <CustomSvg type="JoinOfficialGroup" />
            </div>
            <div className="modal-title">{JoinOfficialGroupTitle}</div>
            <div className="modal-content flex-column">{JoinOfficialGroupContent}</div>
          </div>
        ),
        okText: t('Join'),
        onOk: toJoinOfficialGroup,
      });
    }
  }, [handleCancel, showJoinOfficialGroupTip, t, toJoinOfficialGroup]);
}
