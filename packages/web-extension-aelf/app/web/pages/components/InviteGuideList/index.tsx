import CustomSvg, { SvgType } from 'components/CustomSvg';
import { useMemo } from 'react';
import { useClickReferral } from 'hooks/referral';
import './index.less';

export type TInviteGuideMap = {
  icon: SvgType;
  title: string;
  desc: string;
  onClick: () => void;
};

export interface IInviteGuideList {
  inviteGuideMap?: TInviteGuideMap[];
}

export default function InviteGuideList(props: IInviteGuideList) {
  const { inviteGuideMap } = props;
  const clickReferral = useClickReferral(false);
  const defaultGuideMap: TInviteGuideMap[] = useMemo(
    () => [
      {
        icon: 'InviteFriends',
        title: 'Invite Friends',
        desc: 'Chat with your friends in Portkey',
        onClick: clickReferral,
      },
    ],
    [clickReferral],
  );
  return (
    <div className="invite-guide-component">
      {(inviteGuideMap || defaultGuideMap).map((_guide, i) => (
        <div className="guide-item flex-row-center" key={`${_guide.icon}_${i}`}>
          <div className="guide-item-left flex-row-center" onClick={_guide.onClick}>
            <CustomSvg type={_guide.icon} />
            <div className="guide-item-content flex-column">
              <div className="content-title">{_guide.title}</div>
              <div className="content-desc">{_guide.desc}</div>
            </div>
          </div>
          <div className="guide-item-right">
            <CustomSvg type="Right" />
          </div>
        </div>
      ))}
    </div>
  );
}
