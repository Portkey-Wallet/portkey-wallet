import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { BaseHeaderProps } from 'types/UI';
import MenuList, { IMenuItemProps } from 'pages/components/MenuList';
import { useTranslation } from 'react-i18next';
import './index.less';

export default function ConnectedSitesPopup({ headerTitle, goBack, list }: BaseHeaderProps & IMenuItemProps) {
  const { t } = useTranslation();

  return (
    <div className="connected-sites-popup min-width-max-height connected-sites">
      <div className="connected-sites-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      {list.length === 0 ? (
        <div className="no-data flex-center">{t('No Connected Sites')}</div>
      ) : (
        <MenuList list={list} height={92} />
      )}
    </div>
  );
}
