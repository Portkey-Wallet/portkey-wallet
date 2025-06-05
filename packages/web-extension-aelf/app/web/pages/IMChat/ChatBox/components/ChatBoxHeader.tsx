import { useMemo } from 'react';
import { Avatar, IAvatarProps, IPopoverMenuListData, PopoverMenuList } from '@portkey-wallet/im-ui-web';
import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';

export interface IChatBoxHeaderProps {
  popVisible: boolean;
  popMenuData: IPopoverMenuListData[];
  avatarProps: IAvatarProps;
  titleName?: string;
  isMute?: boolean;
  goBack: () => void;
  setPopVisible: (v: boolean) => void;
  handleClickTitle: () => void;
}
export default function ChatBoxHeader({
  popVisible,
  popMenuData,
  avatarProps,
  titleName,
  isMute,
  goBack,
  setPopVisible,
  handleClickTitle,
}: IChatBoxHeaderProps) {
  const renderTitle = useMemo(
    () => (
      <div className="title-element flex">
        <div className="title-content flex-center" onClick={handleClickTitle}>
          <Avatar className="title-avatar" {...avatarProps} />
          <div className="title-name">{titleName || ''}</div>
        </div>
        {isMute && <CustomSvg type="Mute" />}
      </div>
    ),
    [handleClickTitle, avatarProps, titleName, isMute],
  );

  return (
    <CommonHeader
      className="chat-box-top"
      showBottomBorder
      title={renderTitle}
      rightElementList={[
        {
          customSvgWrapClassName: 'chat-box-more',
          customSvgType: 'More',
          popoverProps: {
            overlayClassName: 'chat-box-popover',
            open: popVisible,
            trigger: 'click',
            showArrow: false,
            content: <PopoverMenuList data={popMenuData} />,
          },
          onClick: () => setPopVisible(!popVisible),
        },
      ]}
      onLeftBack={goBack}
    />
  );
}
