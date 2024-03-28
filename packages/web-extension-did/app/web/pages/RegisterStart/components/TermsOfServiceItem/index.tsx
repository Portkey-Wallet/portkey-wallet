import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import './index.less';

export default function TermsOfServiceItem() {
  return (
    <div className="terms-of-service">
      <span>By proceeding, you agree to the</span>&nbsp;
      <a href={`${OfficialWebsite}/terms-of-service`} target="_blank" rel="noreferrer" className="terms-text-link">
        Terms of Service
      </a>
      &nbsp;and&nbsp;
      <a href={`${OfficialWebsite}/privacy-policy`} target="_blank" rel="noreferrer" className="terms-text-link">
        Privacy Policy
      </a>
    </div>
  );
}
