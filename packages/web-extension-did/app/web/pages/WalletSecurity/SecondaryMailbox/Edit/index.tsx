import { useCommonState } from 'store/Provider/hooks';
import { useCallback, useMemo, useState } from 'react';
import { useLocationState, useNavigateState } from 'hooks/router';
import { Input } from 'antd';
import clsx from 'clsx';
import CommonHeader from 'components/CommonHeader';
import SecondPageHeader from 'pages/components/SecondPageHeader';
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
import './index.less';

export default function SecondaryMailboxEdit() {
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigateState<TSecondaryMailboxVerifyState>();
  const { state } = useLocationState<TSecondaryMailboxEditState>();
  const [val, setVal] = useState(state?.email || '');
  const [errMsg, setErrMsg] = useState('');
  const { secondaryEmail } = useIsSecondaryMailSet();

  const btnDisabled = useMemo(() => !(val && !errMsg && val !== secondaryEmail), [errMsg, secondaryEmail, val]);
  const goBack = useCallback(() => {
    navigate('/setting/wallet-security/secondary-mailbox');
  }, [navigate]);
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
  const mainContent = useMemo(() => {
    return (
      <div
        className={clsx(
          'flex-column-between',
          'flex-1',
          'secondary-mailbox-body',
          isNotLessThan768 ? 'secondary-mailbox-body-prompt' : 'secondary-mailbox-body-popup',
        )}>
        <div className="mailbox-container">
          <div className="mailbox-label">{`Backup Mailbox`}</div>
          <Input
            className="email-input"
            value={val}
            placeholder={`Enter email`}
            onChange={(e) => {
              handleEmailInputChange(e.target.value);
            }}
          />
          <div className="err-msg">{errMsg}</div>
        </div>
        <AsyncButton type="primary" onClick={onSave} disabled={btnDisabled}>
          Save
        </AsyncButton>
      </div>
    );
  }, [isNotLessThan768, val, errMsg, onSave, btnDisabled, handleEmailInputChange]);

  return isNotLessThan768 ? (
    <div className="secondary-mailbox-edit-page flex-column-between secondary-mailbox-edit-prompt">
      <SecondPageHeader title={`Set Secondary Mailbox`} leftCallBack={goBack} />
      {mainContent}
    </div>
  ) : (
    <div className="secondary-mailbox-edit-page flex-column-between secondary-mailbox-edit-popup">
      <CommonHeader className="popup-header-wrap" title={`Set Secondary Mailbox`} onLeftBack={goBack} />
      {mainContent}
    </div>
  );
}
