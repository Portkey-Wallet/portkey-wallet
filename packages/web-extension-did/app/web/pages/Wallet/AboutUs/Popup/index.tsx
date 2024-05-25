import CommonHeader from 'components/CommonHeader';
import AboutUsBody from 'pages/Wallet/components/AboutUsBody';
import { BaseHeaderProps } from 'types/UI';

export default function AboutUsPopup({ headerTitle, goBack }: BaseHeaderProps) {
  return (
    <div className="about-us-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <AboutUsBody />
    </div>
  );
}
