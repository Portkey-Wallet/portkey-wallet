import { useMemo } from 'react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import MenuItem from 'components/MenuItem';
import { useTranslation } from 'react-i18next';
import { IconType } from 'types/icon';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-eoa/network';
import { useSocialMediaList } from '@portkey-wallet/hooks/hooks-eoa/cms';
import './index.less';

interface IMenuItem {
  icon: IconType;
  link: string;
  label: string;
}

export default function AboutUsBody() {
  const { t } = useTranslation();
  const socialMediaList = useSocialMediaList();

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
          <CustomSvgV3 type="app-logo-fairy-vault" className="portkey-icon" />
        </div>
        <span className="name">{t('FairyVault Wallet')}</span>
        <span className="version">{`${process.env.SDK_VERSION?.toUpperCase()}`}</span>
      </div>
      <div className="content">
        <div className="content-item social">
          {socialMediaList.map((item) => (
            <a key={item.title} href={item.link} target="_blank" rel="noreferrer">
              <MenuItem height={54}>{t(item.title)}</MenuItem>
            </a>
          ))}
          <a href={OfficialWebsite} target="_blank" rel="noreferrer">
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
