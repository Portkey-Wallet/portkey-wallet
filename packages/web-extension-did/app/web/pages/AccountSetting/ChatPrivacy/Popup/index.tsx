import BackHeader from 'components/BackHeader';
import { IChatPrivacyProps } from '..';
import CustomSvg from 'components/CustomSvg';
import MenuList from 'pages/components/MenuList';
import './index.less';

export default function ChatPrivacyPopup({ headerTitle, goBack, menuList, menuItemHeight }: IChatPrivacyProps) {
  return (
    <div className="min-width-max-height chat-privacy-popup">
      <div className="chat-privacy-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>

      <MenuList list={menuList} height={menuItemHeight} />
    </div>
  );
}
