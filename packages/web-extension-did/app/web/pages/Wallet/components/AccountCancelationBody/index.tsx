import { CustomSvgV3 } from 'components/CustomSvgV3';
import {
  ACCOUNT_CANCELATION_CONDITIONS,
  ACCOUNT_CANCELATION_NOTE,
  ACCOUNT_CANCELATION_TIP,
} from '@portkey-wallet/constants/constants-ca/wallet';
import AsyncButton from 'components/AsyncButton';
import './index.less';

interface IAccountCancelationBody {
  onConfirm: () => Promise<void>;
  showGuardianType: string;
}

export default function AccountCancelationBody({ onConfirm, showGuardianType }: IAccountCancelationBody) {
  return (
    <div className="account-cancelation-body flex-column-between">
      <div className="account-cancelation-container flex-column-center">
        <CustomSvgV3 type="warning" fillColor="#F1A282" className="warning-icon" />
        <div className="container-tip text-center">{ACCOUNT_CANCELATION_TIP}</div>
        <div className="container-content flex-column">
          <div className="container-content-tip">{ACCOUNT_CANCELATION_NOTE}</div>
          {ACCOUNT_CANCELATION_CONDITIONS.map((note, index) => (
            <div className="container-content-note" key={`note_${index}`}>
              <div className="note-title">{`${index + 1}. ${note.title}`}</div>
              <div>{note.content.replace(/LOGIN_ACCOUNT/g, showGuardianType)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="account-cancelation-footer">
        <div className="footer">
          <AsyncButton type="primary" htmlType="submit" className="edit-btn" onClick={onConfirm}>
            Confirm account deletion
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
