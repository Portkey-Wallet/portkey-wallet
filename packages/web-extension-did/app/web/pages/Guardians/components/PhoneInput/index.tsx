import PhoneNumberInput from 'components/PhoneNumberInput';
import { useMemo, useState } from 'react';
import { useLoginInfo } from 'store/Provider/hooks';
import { countryCodeFilter } from '@portkey-wallet/constants/constants-ca/country';
import { ISelectCountryCode } from 'store/reducers/loginCache/type';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';

interface PhoneProps {
  code?: string;
  onChange: (phoneNumber: { code: string; phoneNumber: string }) => void;
}

export default function PhoneInput({ code, onChange }: PhoneProps) {
  const { countryCode } = useLoginInfo();
  const { phoneCountryCodeList } = usePhoneCountryCode();
  const defaultCountryCode = useMemo(() => {
    if (code) {
      const defaultCountryCode = countryCodeFilter(code, phoneCountryCodeList);
      if (defaultCountryCode.length) {
        return {
          index: defaultCountryCode[0].country[0],
          country: {
            ...defaultCountryCode[0],
          },
        };
      }
      return countryCode;
    }
    return countryCode;
  }, [code, countryCode, phoneCountryCodeList]);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [areaValue, setAreaValue] = useState<ISelectCountryCode>(defaultCountryCode);

  return (
    <div className="phone-tab-wrapper">
      <PhoneNumberInput
        area={areaValue}
        phoneNumber={phoneNumber}
        onAreaChange={(v) => {
          setAreaValue(v);
          onChange({ code: v.country.code, phoneNumber });
        }}
        onPhoneNumberChange={(v) => {
          setPhoneNumber(v);
          onChange({ code: areaValue?.country.code || '', phoneNumber: v });
        }}
      />
    </div>
  );
}
