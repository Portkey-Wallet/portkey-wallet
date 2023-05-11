import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import AboutUsBody from 'pages/Wallet/components/AboutUsBody';
import { BaseHeaderProps } from 'types/UI';
import './index.less';

export default function AboutUsPopup({ headerTitle, goBack }: BaseHeaderProps) {
  return (
    <div className="about-us-popup min-width-max-height">
      <div className="nav-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <AboutUsBody />
    </div>
  );
}
