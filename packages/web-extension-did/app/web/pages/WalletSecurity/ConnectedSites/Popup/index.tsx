import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { BaseHeaderProps } from 'types/UI';
import ConnectedSiteList, { IConnectedSiteListProps } from 'pages/WalletSecurity/components/ConnectedSiteList';
import './index.less';

export default function ConnectedSitesPopup({
  headerTitle,
  goBack,
  list,
  onDisconnect,
}: BaseHeaderProps & IConnectedSiteListProps) {
  return (
    <div className="connected-sites-popup min-width-max-height">
      <div className="connected-sites-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <ConnectedSiteList list={list} onDisconnect={onDisconnect} />
    </div>
  );
}
