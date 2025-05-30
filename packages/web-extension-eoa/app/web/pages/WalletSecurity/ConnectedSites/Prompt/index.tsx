import SecondPageHeader from 'pages/components/SecondPageHeader';
import { Outlet } from 'react-router';
import { BaseHeaderProps } from 'types/UI';
import MenuList, { IMenuItemProps } from 'pages/components/MenuList';
import { useTranslation } from 'react-i18next';
import './index.less';

export default function ConnectedSitesPrompt({ headerTitle, goBack, list }: BaseHeaderProps & IMenuItemProps) {
  const { t } = useTranslation();
  return (
    <div className="connected-sites-prompt connected-sites">
      <div className="connected-sites-prompt-body">
        <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
        {list.length === 0 ? (
          <div className="no-data flex-center">{t('No Connected Sites')}</div>
        ) : (
          <MenuList list={list} height={92} />
        )}
      </div>
      <Outlet />
    </div>
  );
}
