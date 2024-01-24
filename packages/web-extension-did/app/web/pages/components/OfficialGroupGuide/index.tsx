import { Avatar } from '@portkey-wallet/im-ui-web';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useJoinGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import useGuide, { TGuideInfoRes } from '@portkey-wallet/hooks/hooks-ca/guide';
import { GuideTypeEnum, JOIN_OFFICIAL_GROUP_ERROR_TIP } from '@portkey-wallet/constants/constants-ca/guide';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { ALREADY_JOINED_GROUP_CODE } from '@portkey-wallet/constants/constants-ca/chat';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';

export type TOfficialGroupGuideMap = {
  icon: string;
  title: string;
  show: boolean;
  onClick: () => void;
};

export interface IOfficialGroupGuide {
  officialGroupGuideMap?: TOfficialGroupGuideMap[];
}

export default function OfficialGroupGuide(props: IOfficialGroupGuide) {
  const { officialGroupGuideMap } = props;
  const navigate = useNavigateState();
  const { isPrompt } = useCommonState();
  const officialGroupIdRef = useRef<string>('');
  const joinGroupChannel = useJoinGroupChannel();
  const { getGuideItem, finishGuideItem } = useGuide();
  const [isOfficialGroupMember, setIsOfficialGroupMember] = useState(true);
  const defaultOfficialGroupGuideMap: TOfficialGroupGuideMap[] = useMemo(
    () => [
      {
        icon: 'PortkeyGroup',
        title: 'Portkey Official Group',
        show: !isPrompt && !isOfficialGroupMember,
        onClick: async () => {
          if (!officialGroupIdRef.current) {
            return singleMessage.error(JOIN_OFFICIAL_GROUP_ERROR_TIP);
          }
          try {
            await finishGuideItem(GuideTypeEnum.JoinOfficialGroup);
          } catch (error) {
            console.log('===finishGuideItem JoinOfficialGroup error', error);
          }
          try {
            await joinGroupChannel(officialGroupIdRef.current);
            navigate(`/chat-box-group/${officialGroupIdRef.current}`);
          } catch (error: any) {
            // already joined
            if (`${error?.code}` === ALREADY_JOINED_GROUP_CODE) {
              navigate(`/chat-box-group/${officialGroupIdRef.current}`);
            } else {
              singleMessage.error(JOIN_OFFICIAL_GROUP_ERROR_TIP);
              console.log('===Failed to join official group error', error);
            }
          }
        },
      },
    ],
    [finishGuideItem, isOfficialGroupMember, isPrompt, joinGroupChannel, navigate],
  );
  const officialGroupGuideMapShow = useMemo(
    () => (officialGroupGuideMap || defaultOfficialGroupGuideMap).filter((item) => item.show),
    [officialGroupGuideMap, defaultOfficialGroupGuideMap],
  );

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
  }, [getGuideItem, setIsOfficialGroupMember]);

  useEffect(() => {
    checkIsOfficialMember();
  }, [checkIsOfficialMember]);

  return officialGroupGuideMapShow?.length === 0 ? (
    <></>
  ) : (
    <div className="official-group-guide-component flex-column">
      <div className="official-group-guide-title">Official Group</div>
      <div className="official-group-guide-container">
        {officialGroupGuideMapShow.map((_guide, i) => (
          <div className="guide-item flex-row-center" key={`${_guide.icon}_${i}`}>
            <div className="guide-item-left flex-row-center">
              <Avatar svgSrc={_guide.icon} isGroupAvatar />
              <div className="content-title">{_guide.title}</div>
            </div>
            <div className="guide-item-right" onClick={_guide.onClick}>
              Chat
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
