import PhoneNumberInput from 'components/PhoneNumberInput';
import { useMemo, useState } from 'react';
import { countryCodeFilter } from '@portkey-wallet/constants/constants-ca/country';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';

interface PhoneProps {
  code?: string;
  phoneNumber?: string;
  onChange: (phoneNumber: { code: string; phoneNumber: string }) => void;
}

export default function PhoneInput({ code, phoneNumber: phoneNum = '', onChange }: PhoneProps) {
  const { localPhoneCountryCode: countryCode, phoneCountryCodeList, setLocalPhoneCountryCode } = usePhoneCountryCode();
  const defaultCountryCode = useMemo(() => {
    if (code) {
      const defaultCountryCode = countryCodeFilter(code, phoneCountryCodeList);
      if (defaultCountryCode.length) {
        return {
          ...defaultCountryCode[0],
        };
      }
      return countryCode;
    }
    return countryCode;
  }, [code, countryCode, phoneCountryCodeList]);
  const [phoneNumber, setPhoneNumber] = useState<string>(phoneNum);
  const [areaValue, setAreaValue] = useState<CountryItem>(defaultCountryCode);

  return (
    <div className="phone-tab-wrapper">
      <PhoneNumberInput
        area={areaValue}
        phoneNumber={phoneNumber}
        onAreaChange={(v) => {
          setAreaValue(v);
          onChange({ code: v.code, phoneNumber });
          setLocalPhoneCountryCode(v);
        }}
        onPhoneNumberChange={(v) => {
          setPhoneNumber(v);
          onChange({ code: areaValue?.code || '', phoneNumber: v });
        }}
      />
    </div>
  );
}
