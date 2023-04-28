import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { IAccountSettingProps } from '../index';
import { useNavigate } from 'react-router';
import './index.less';
import MenuList from 'pages/components/MenuList';

export default function AccountSettingPopup({ headerTitle, menuList }: IAccountSettingProps) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/setting');
  };

  return (
    <div className="account-setting-popup min-width-max-height">
      <div className="header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <MenuList list={menuList} height={53} />
    </div>
  );
}
