import { request } from '@portkey-wallet/api/api-did';
import { useState, useCallback, useEffect } from 'react';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';

const useIpInfo = () => {
  const [ipInfo, setIpInfo] = useState<CountryItem>();
  const getIpInfo = useCallback(async () => {
    try {
      const res = await request.verify.getCountry({
        method: 'get',
      });
      setIpInfo(res);
    } catch (error) {
      console.log(error, 'useIpInfo');
    }
  }, []);

  useEffect(() => {
    getIpInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ipInfo;
};

export default useIpInfo;
