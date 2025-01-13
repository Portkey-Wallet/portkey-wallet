// import { Image } from 'antd';
import { useMemo } from 'react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import MenuItem from 'components/MenuItem';
import { useTranslation } from 'react-i18next';
import { IconType } from 'types/icon';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { useSocialMediaList } from '@portkey-wallet/hooks/hooks-ca/cms';
// import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import './index.less';

interface IMenuItem {
  icon: IconType;
  link: string;
  label: string;
}

export default function AboutUsBody() {
  const { t } = useTranslation();
  const socialMediaList = useSocialMediaList();
  // const { s3Url } = useCurrentNetworkInfo();

  const serviceList: IMenuItem[] = useMemo(
    () => [
      {
        icon: 'Basic',
        label: 'Terms of service',
        link: `${OfficialWebsite}/terms-of-service`,
      },
      {
        icon: 'PortkeyPrivacyPolicy',
        label: 'Privacy policy',
        link: `${OfficialWebsite}/privacy-policy`,
      },
    ],
    [],
  );

  return (
    <div className="about-us-body">
      <div className="flex-column-center logo-wrapper">
        <div className="flex-center logo">
          <CustomSvgV3 type="Guardians=Portkey" className="portkey-icon" />
        </div>
        <span className="name">{t('Portkey')}</span>
        <span className="version">{`${process.env.SDK_VERSION?.toUpperCase()}`}</span>
      </div>
      <div className="content">
        <div className="content-item social">
          {socialMediaList.map((item) => (
            <a key={item.title} href={item.link} target="_blank" rel="noreferrer">
              <MenuItem height={54}>{t(item.title)}</MenuItem>
            </a>
          ))}
          <a href="https://portkey.finance/" target="_blank" rel="noreferrer">
            <MenuItem height={54}>{t('View website')}</MenuItem>
          </a>
        </div>
        <div className="divider" />
        <div className="content-item service">
          {serviceList.map((item) => (
            <a key={item.label} href={item.link} target="_blank" rel="noreferrer">
              <MenuItem height={54}>{t(item.label)}</MenuItem>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
