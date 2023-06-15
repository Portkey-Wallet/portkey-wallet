import SecondPageHeader from 'pages/components/SecondPageHeader';
import ConnectedSiteList, { IConnectedSiteListProps } from 'pages/WalletSecurity/components/ConnectedSiteList';
import { Outlet } from 'react-router';
import { BaseHeaderProps } from 'types/UI';
import './index.less';

export default function ConnectedSitesPrompt({
  headerTitle,
  goBack,
  list,
  onDisconnect,
}: BaseHeaderProps & IConnectedSiteListProps) {
  return (
    <div className="connected-sites-prompt">
      <div className="connected-sites-prompt-body">
        <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
        <ConnectedSiteList list={list} onDisconnect={onDisconnect} />
      </div>
      <Outlet />
    </div>
  );
}
