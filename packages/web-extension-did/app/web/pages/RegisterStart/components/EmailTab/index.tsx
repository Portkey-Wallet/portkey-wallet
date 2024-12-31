import { useCallback, useRef, useState } from 'react';
import { ValidateHandler } from 'types/wallet';
import EmailInput, { EmailInputInstance } from '../EmailInput';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { CommonButton } from '@portkey/did-ui-react';

interface EmailTabProps {
  confirmText: string;
  validateEmail?: ValidateHandler;
  onFinish?: (email: string) => void;
  loading: boolean;
}

export default function EmailTab({ confirmText, validateEmail, onFinish, loading: btnLoading }: EmailTabProps) {
  const [val, setVal] = useState<string>();
  const [error, setError] = useState<string>();
  const emailInputInstance = useRef<EmailInputInstance>();
  const [loading, setLoading] = useState(false);
  const onClick = useCallback(async () => {
    try {
      setLoading(true);
      await emailInputInstance?.current?.validateEmail(val);
      if (val && onFinish) {
        val && onFinish(val);
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      const msg = handleErrorMessage(error);
      setError(msg);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [onFinish, setLoading, val]);

  return (
    <div className="email-sign-wrapper">
      <EmailInput
        val={val}
        ref={emailInputInstance}
        validate={validateEmail}
        error={error}
        onChange={(v) => {
          setError(undefined);
          setVal(v);
        }}
      />
      <CommonButton
        loading={loading || btnLoading}
        className="login-primary-btn"
        type="primary"
        disabled={!val || !!error}
        onClick={onClick}>
        {confirmText}
      </CommonButton>
    </div>
  );
}
