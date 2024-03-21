import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function RegisterHeader() {
  return (
    <div className="register-header-wrapper">
      <div className="flex-row-center register-header-content">
        <CustomSvg type="PortKeyPrompt" className="portkey-logo" />
      </div>
    </div>
  );
}
