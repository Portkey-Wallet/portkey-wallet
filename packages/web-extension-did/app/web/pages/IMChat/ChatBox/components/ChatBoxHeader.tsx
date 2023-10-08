import { IPopoverMenuListData, PopoverMenuList } from '@portkey-wallet/im-ui-web';
import { Popover } from 'antd';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { ReactNode } from 'react';

export interface IChatBoxHeaderProps {
  popVisible: boolean;
  popMenuData: IPopoverMenuListData[];
  renderTitle: ReactNode;
  goBack: () => void;
  setPopVisible: (v: boolean) => void;
}
export default function ChatBoxHeader({
  popVisible,
  renderTitle,
  popMenuData,
  goBack,
  setPopVisible,
}: IChatBoxHeaderProps) {
  return (
    <div className="chat-box-top">
      <SettingHeader
        title={renderTitle}
        leftCallBack={goBack}
        rightElement={
          <div className="flex-center right-element">
            <Popover
              open={popVisible}
              overlayClassName="chat-box-popover"
              trigger="click"
              showArrow={false}
              content={<PopoverMenuList data={popMenuData} />}>
              <div className="chat-box-more" onClick={() => setPopVisible(!popVisible)}>
                <CustomSvg type="More" />
              </div>
            </Popover>
            <CustomSvg type="Close2" onClick={goBack} />
          </div>
        }
      />
    </div>
  );
}
