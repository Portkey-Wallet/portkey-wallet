import { useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import MenuItem from 'components/MenuItem';
import { useTranslation } from 'react-i18next';
import { IconType } from 'types/icon';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import './index.less';

interface IMenuItem {
  icon: IconType;
  link: string;
  label: string;
}

export default function AboutUsBody() {
  const { t } = useTranslation();

  const socialList: IMenuItem[] = useMemo(
    () => [
      {
        icon: 'Twitter',
        label: 'Follow us on Twitter',
        link: 'https://twitter.com/Portkey_DID',
      },
      {
        icon: 'Discord',
        label: 'Join us on Discord',
        link: 'https://discord.com/invite/EUBq3rHQhr',
      },
      {
        icon: 'Telegram',
        label: 'Join us on Telegram',
        link: 'https://t.me/Portkey_Official_Group',
      },
    ],
    [],
  );

  const serviceList: IMenuItem[] = useMemo(
    () => [
      {
        icon: 'Basic',
        label: 'Terms of service',
        link: `${OfficialWebsite}/terms-of-service`,
      },
    ],
    [],
  );

  return (
    <div className="about-us-body">
      <div className="flex-column-center logo-wrapper">
        <div className="flex-center logo">
          <CustomSvg type="PortKey" />
        </div>
        <span className="name">{t('Portkey')}</span>
        <span className="version">{`${process.env.SDK_VERSION?.toUpperCase()} beta`}</span>
      </div>
      <div className="content">
        <div className="content-item social">
          {socialList.map((item) => (
            <MenuItem key={item.label} height={56} icon={<CustomSvg type={item.icon || 'Aelf'} />}>
              <a href={item.link} target="_blank" rel="noreferrer">
                {t(item.label)}
              </a>
            </MenuItem>
          ))}
        </div>
        <div className="content-item service">
          {serviceList.map((item) => (
            <MenuItem key={item.label} height={56} icon={<CustomSvg type={item.icon || 'Aelf'} />}>
              <a href={item.link} target="_blank" rel="noreferrer">
                {t(item.label)}
              </a>
            </MenuItem>
          ))}
        </div>
      </div>
    </div>
  );
}
