import SecondPageHeader from 'pages/components/SecondPageHeader';
import SiteItem, { ISiteItemProps } from 'pages/WalletSecurity/components/SiteItem';
import { BaseHeaderProps } from 'types/UI';
import './index.less';

export default function SiteDetailPrompt({ headerTitle, goBack, siteItem }: BaseHeaderProps & ISiteItemProps) {
  return (
    <div className="site-detail-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <div className="site-item">
        <SiteItem siteItem={siteItem} />
      </div>
    </div>
  );
}
