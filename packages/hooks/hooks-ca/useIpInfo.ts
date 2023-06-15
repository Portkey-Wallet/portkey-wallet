import { useState, useCallback, useEffect } from 'react';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';
import { usePhoneCountryCode } from './misc';

const useIpInfo = () => {
  const [ipInfo, setIpInfo] = useState<CountryItem>();
  const { localPhoneCountryCode } = usePhoneCountryCode();
  const getIpInfo = useCallback(async () => {
    try {
      setIpInfo(localPhoneCountryCode);
    } catch (error) {
      console.log(error, 'useIpInfo');
    }
  }, [localPhoneCountryCode]);

  useEffect(() => {
    getIpInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ipInfo;
};

export default useIpInfo;
