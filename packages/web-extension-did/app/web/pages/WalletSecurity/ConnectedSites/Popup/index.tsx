import CommonHeader from 'components/CommonHeader';
import { BaseHeaderProps } from 'types/UI';
import MenuList, { IMenuItemProps } from 'pages/components/MenuList';
import { useTranslation } from 'react-i18next';

export default function ConnectedSitesPopup({ headerTitle, goBack, list }: BaseHeaderProps & IMenuItemProps) {
  const { t } = useTranslation();

  return (
    <div className="connected-sites-popup min-width-max-height connected-sites">
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
      {list.length === 0 ? (
        <div className="no-data flex-center">{t('No Connected Sites')}</div>
      ) : (
        <MenuList list={list} height={92} />
      )}
    </div>
  );
}
