import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import './index.less';

export default function TermsOfServiceItem() {
  return (
    <div className="terms-of-service-item">
      <span>Use the application according to</span>
      <a href={`${OfficialWebsite}/terms-of-service`} target="_blank" rel="noreferrer" className="terms-text">
        Terms of service
      </a>
    </div>
  );
}
