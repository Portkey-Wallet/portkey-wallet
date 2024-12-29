import { useMemo } from 'react';
import ImageDisplay from '../ImageDisplay';
import './index.less';

export type TDappSiteInfoProps = {
  title?: string;
  dappInfo?: { icon?: string; origin?: string; href?: string; name?: string };
};

export const DappSiteInfo = ({ title, dappInfo }: TDappSiteInfoProps) => {
  const siteUrl = useMemo(() => {
    return dappInfo?.origin || dappInfo?.href;
  }, [dappInfo?.href, dappInfo?.origin]);

  return (
    <div className="dapp-site-info">
      <ImageDisplay defaultHeight={48} className="dapp-site-logo" src={dappInfo?.icon} backupSrc="Dapp=Others" />
      <div className="dapp-site-body">
        {title && <span className="dapp-site-title">{title}</span>}
        {siteUrl && <span className="dapp-site-origin">{siteUrl}</span>}
      </div>
    </div>
  );
};
