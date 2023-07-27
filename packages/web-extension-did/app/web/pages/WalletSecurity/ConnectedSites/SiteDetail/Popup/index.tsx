import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { BaseHeaderProps } from 'types/UI';
import SiteItem, { ISiteItemProps } from 'pages/WalletSecurity/components/SiteItem';
import './index.less';

export default function SiteDetailPopup({ headerTitle, goBack, siteItem }: BaseHeaderProps & ISiteItemProps) {
  return (
    <div className="site-detail-popup min-width-max-height">
      <div className="site-detail-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <div className="site-item">
        <SiteItem siteItem={siteItem} />
      </div>
    </div>
  );
}
