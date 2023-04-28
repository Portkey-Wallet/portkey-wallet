import { Button } from 'antd';
import PhoneNumberInput from 'components/PhoneNumberInput';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { useAppDispatch, useLoginInfo } from 'store/Provider/hooks';
import { setCountryCodeAction } from 'store/reducers/loginCache/actions';
import { ValidateHandler } from 'types/wallet';
import './index.less';

interface PhoneTabProps {
  confirmText: string;
  error?: string;
  validate?: ValidateHandler;
  onFinish?: (phoneNumber: { code: string; phoneNumber: string }) => void;
}

const PhoneTab = forwardRef(({ confirmText, error, validate, onFinish }: PhoneTabProps, ref) => {
  const { countryCode } = useLoginInfo();

  const validatePhone = useCallback(
    async (phone?: string) => {
      await validate?.(phone);
    },
    [validate],
  );

  useImperativeHandle(ref, () => ({ validatePhone }));

  const dispatch = useAppDispatch();

  const [phoneNumber, setPhoneNumber] = useState<string>('');

  return (
    <div className="phone-tab-wrapper">
      <PhoneNumberInput
        area={countryCode}
        phoneNumber={phoneNumber}
        onAreaChange={(v) => dispatch(setCountryCodeAction(v))}
        onPhoneNumberChange={(v) => setPhoneNumber(v)}
      />
      {error && <span className="error-text">{error}</span>}

      <Button
        disabled={!phoneNumber}
        className="login-btn"
        type="primary"
        onClick={async () => {
          await validatePhone(`+${countryCode.country.code} ${phoneNumber}`);
          onFinish?.({
            code: countryCode.country.code,
            phoneNumber,
          });
        }}>
        {confirmText}
      </Button>
    </div>
  );
});

export default PhoneTab;
