import CommonHeader from 'components/CommonHeader';
import { BaseHeaderProps } from 'types/UI';
import SiteItem, { ISiteItemProps } from 'pages/WalletSecurity/components/SiteItem';
import './index.less';

export default function SiteDetailPopup({ headerTitle, goBack, siteItem }: BaseHeaderProps & ISiteItemProps) {
  return (
    <div className="site-detail-popup min-width-max-height">
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
      <div className="site-item">
        <SiteItem siteItem={siteItem} />
      </div>
    </div>
  );
}
