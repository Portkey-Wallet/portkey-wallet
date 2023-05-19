import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import { Button, Input } from 'antd';
import { useState } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { setCountryModal } from 'store/reducers/modal/slice';

export default function Example() {
  const dispatch = useAppDispatch();
  const { localPhoneCountryCode: countryCode } = usePhoneCountryCode();
  const [phoneNum, setPhoneNum] = useState<string>();

  return (
    <div>
      <Input
        value={phoneNum}
        onChange={(e) => {
          setPhoneNum(e.target.value);
        }}
        addonBefore={
          <div
            onClick={() => {
              dispatch(setCountryModal(true));
            }}>
            {countryCode ? `+${countryCode.code}` : ''}
          </div>
        }
      />
      <Button
        onClick={() => {
          dispatch(setCountryModal(true));
        }}>
        CountryCode
      </Button>
    </div>
  );
}
