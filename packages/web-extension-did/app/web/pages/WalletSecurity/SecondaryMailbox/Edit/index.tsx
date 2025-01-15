import { useCallback, useMemo, useState } from 'react';
import { useLocationState, useNavigateState } from 'hooks/router';
import { Input } from 'antd';
import CommonHeader from 'components/CommonHeader';
import { EmailReg } from '@portkey-wallet/utils/reg';
import { EmailError } from '@portkey-wallet/utils/check';
import { TSecondaryMailboxEditState, TSecondaryMailboxVerifyState } from 'types/router';
import { useIsSecondaryMailSet } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import AsyncButton from 'components/AsyncButton';
import { verification } from 'utils/api';
import { SendSecondVerificationConfig } from '@portkey-wallet/api/api-did/verification/utils';
import { PlatformType } from '@portkey-wallet/types/verifier';
import { CommonPromptCard } from '@portkey/did-ui-react';
import { PromptCardType } from '@portkey/did-ui-react/dist/_types/src/components/CommonPromptCard';
import './index.less';

export default function SecondaryMailboxEdit() {
  const navigate = useNavigateState<TSecondaryMailboxVerifyState>();
  const { state } = useLocationState<TSecondaryMailboxEditState>();
  const [val, setVal] = useState(state?.email || '');
  const [errMsg, setErrMsg] = useState('');
  const { secondaryEmail } = useIsSecondaryMailSet();

  const btnDisabled = useMemo(() => !(val && !errMsg && val !== secondaryEmail), [errMsg, secondaryEmail, val]);
  const goBack = useCallback(() => {
    if (state?.email) {
      navigate('/setting/wallet-security/secondary-mailbox');
    } else {
      navigate('/setting');
    }
  }, [navigate, state?.email]);
  const handleEmailInputChange = useCallback((v: string) => {
    setErrMsg('');
    setVal(v);
  }, []);
  const onSave = useCallback(async () => {
    if (!EmailReg.test(val as string)) {
      setErrMsg(EmailError.invalidEmail);
      return;
    }
    try {
      const config: SendSecondVerificationConfig = {
        params: {
          secondaryEmail: val,
          platformType: PlatformType.EXTENSION,
        },
      };
      const res = await verification.sendSecondaryVerificationCode(config);

      if (res.verifierSessionId) {
        navigate('/setting/wallet-security/secondary-mailbox-verify', {
          state: {
            email: val,
            sessionid: res.verifierSessionId,
          },
        });
      } else {
        throw new Error('send fail');
      }
    } catch (error) {
      console.log('===sendSecondaryEmailCode error', error);
      singleMessage.error(handleErrorMessage(error || 'send fail'));
    }
  }, [navigate, val]);

  return (
    <div className="secondary-mailbox-page flex-column-between secondary-mailbox-popup">
      <CommonHeader className="popup-header-wrap" title={`Backup Email`} onLeftBack={goBack} />
      <div className="flex-column-between flex-1 secondary-mailbox-body secondary-mailbox-body-popup customer-form">
        <div className="mailbox-container">
          <div className="mailbox-label">{`Add a backup email address`}</div>
          <Input
            className="email-input"
            value={val}
            placeholder={`Enter email`}
            allowClear
            onChange={(e) => {
              handleEmailInputChange(e.target.value);
            }}
          />
          <div className="err-msg">{errMsg}</div>
          <CommonPromptCard
            className="mailbox-tip"
            title=""
            type={'info' as PromptCardType}
            description="Notifications for authorizing or signing transactions will be sent to your guardian's email. If unavailable, they'll go to your backup email."
          />
        </div>
        <AsyncButton type="primary" onClick={onSave} disabled={btnDisabled}>
          Verify email
        </AsyncButton>
      </div>
    </div>
  );
}
