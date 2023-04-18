import SecondPageHeader from 'pages/components/SecondPageHeader';
import AboutUsBody from 'pages/Wallet/components/AboutUsBody';
import { BaseHeaderProps } from 'types/UI';
import './index.less';

export default function AboutUsPrompt({ headerTitle, goBack }: BaseHeaderProps) {
  return (
    <div className="about-us-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <div className="about-us-body-wrapper">
        <AboutUsBody />
      </div>
    </div>
  );
}
