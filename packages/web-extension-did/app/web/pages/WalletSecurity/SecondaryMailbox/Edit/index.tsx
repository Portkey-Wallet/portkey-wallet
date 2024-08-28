import { useCommonState } from 'store/Provider/hooks';
import { useCallback, useMemo, useState } from 'react';
import { useLocationState, useNavigateState } from 'hooks/router';
import { Button, Input } from 'antd';
import clsx from 'clsx';
import CommonHeader from 'components/CommonHeader';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { EmailReg } from '@portkey-wallet/utils/reg';
import { EmailError } from '@portkey-wallet/utils/check';
import { TSecondaryMailboxEditState, TSecondaryMailboxVerifyState } from 'types/router';
import './index.less';

export default function SecondaryMailboxEdit() {
  const { isNotLessThan768 } = useCommonState();
  const navigate = useNavigateState<TSecondaryMailboxVerifyState>();
  const { state } = useLocationState<TSecondaryMailboxEditState>();
  const [val, setVal] = useState(state?.email || '');
  const [errMsg, setErrMsg] = useState('');
  const btnDisabled = useMemo(() => !(val && !errMsg), [errMsg, val]);
  const goBack = useCallback(() => {
    navigate('/setting/wallet-security/secondary-mailbox');
  }, [navigate]);
  const handleEmailInputChange = useCallback((v: string) => {
    setErrMsg('');
    setVal(v);
  }, []);
  const onSave = useCallback(() => {
    if (!EmailReg.test(val as string)) {
      setErrMsg(EmailError.invalidEmail);
      return;
    }
    // TODO-SA
    navigate('/setting/wallet-security/secondary-mailbox-verify', {
      state: {
        email: val,
        sessionid: 'sss',
      },
    });
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
          <div className="mailbox-label">{`Secondary Mailbox`}</div>
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
        <Button type="primary" onClick={onSave} disabled={btnDisabled}>
          Save
        </Button>
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
