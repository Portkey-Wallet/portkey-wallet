import CommonHeader from 'components/CommonHeader';
import { IAccountSettingProps } from '../index';
import { useNavigate } from 'react-router';
import MenuList from 'pages/components/MenuList';

export default function AccountSettingPopup({ headerTitle, menuList }: IAccountSettingProps) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/setting');
  };

  return (
    <div className="account-setting-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <MenuList list={menuList} height={53} />
    </div>
  );
}
