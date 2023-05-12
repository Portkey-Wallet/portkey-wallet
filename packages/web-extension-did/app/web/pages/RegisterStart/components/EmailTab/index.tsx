import { Button } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { ValidateHandler } from 'types/wallet';
import EmailInput, { EmailInputInstance } from '../EmailInput';
import { useLoading } from 'store/Provider/hooks';
import { handleErrorMessage } from '@portkey-wallet/utils';

interface EmailTabProps {
  confirmText: string;
  validateEmail?: ValidateHandler;
  onFinish?: (email: string) => void;
}

export default function EmailTab({ confirmText, validateEmail, onFinish }: EmailTabProps) {
  const [val, setVal] = useState<string>();
  const [error, setError] = useState<string>();
  const emailInputInstance = useRef<EmailInputInstance>();
  const { setLoading } = useLoading();
  const onClick = useCallback(async () => {
    try {
      setLoading(true, 'Checking account on the chain...');
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
      <Button className="login-primary-btn" type="primary" disabled={!val || !!error} onClick={onClick}>
        {confirmText}
      </Button>
    </div>
  );
}
