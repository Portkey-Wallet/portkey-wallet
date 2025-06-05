import CommonHeader from 'components/CommonHeader';
import MenuList from 'pages/components/MenuList';
import { ISecurityProps } from '..';
import './index.less';

export default function SecurityPopup({ headerTitle, menuList, goBack }: ISecurityProps) {
  return (
    <div className="flex-column wallet-popup min-width-max-height">
      <div>
        <CommonHeader title={headerTitle} onLeftBack={goBack} />

        <MenuList list={menuList} height={48} />
      </div>
    </div>
  );
}
