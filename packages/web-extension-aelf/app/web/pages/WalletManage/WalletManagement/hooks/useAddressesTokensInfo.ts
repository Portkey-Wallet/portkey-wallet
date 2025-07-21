import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTokenList } from '@portkey-wallet/store/store-eoa/assets/api';
import { ChainId } from '@portkey-wallet/types/index';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';

const ChainIdsMainnet: ChainId[] = ['AELF', 'tDVV'];
const ChainIdsTestnet: ChainId[] = ['AELF', 'tDVW'];
const cachedAddressesTotalBalanceInUsdMemory = {
  MAINNET: {},
  TESTNET: {},
};
export const useAddressesTokensInfo = (addresses: string[]) => {
  const [addressesTotalBalanceInUsd, setAddressesTotalBalanceInUsd] = useState<{ [key: string]: string }>();
  const currentNetwork = useCurrentNetwork();
  const cachedAddressesTotalBalanceInUsdRef = useRef<{ [key: string]: any }>({});

  const getTokensInfo = useCallback(async () => {
    const start = Date.now();
    const addressInfosList = addresses.map((address) => {
      return (currentNetwork === 'MAINNET' ? ChainIdsMainnet : ChainIdsTestnet).map((chainId) => ({
        chainId,
        address,
      }));
    });
    const fetchTokenListPromises = addressInfosList.map((addressInfo) => {
      const addressInfos = addressInfo.flat();
      return fetchTokenList({ addressInfos, skipCount: 0, maxResultCount: 1000 });
    });
    const result = await Promise.all(fetchTokenListPromises);

    const _addressesTotalBalanceInUsd: {
      [key: string]: any;
    } = {};
    addresses.forEach((address, index) => {
      _addressesTotalBalanceInUsd[address] = result[index].totalBalanceInUsd;
    });
    cachedAddressesTotalBalanceInUsdRef.current[currentNetwork] = _addressesTotalBalanceInUsd;
    cachedAddressesTotalBalanceInUsdMemory[currentNetwork] = _addressesTotalBalanceInUsd;
    console.log('getTokensInfo TokensInfo: ', result, addresses, addressInfosList, _addressesTotalBalanceInUsd);
    console.log('getTokensInfo time:', Date.now() - start);
    return _addressesTotalBalanceInUsd;
  }, [addresses, currentNetwork]);

  useEffect(() => {
    if (addresses.length === 0) {
      return;
    }
    // console.log(
    //   'cachedAddressesTotalBalanceInUsdMemory: ',
    //   cachedAddressesTotalBalanceInUsdMemory,
    //   cachedAddressesTotalBalanceInUsdRef.current,
    //   cachedAddressesTotalBalanceInUsdRef.current && cachedAddressesTotalBalanceInUsdRef.current[currentNetwork]
    //     ? Object.keys(cachedAddressesTotalBalanceInUsdRef.current[currentNetwork]).length
    //     : null,
    //   cachedAddressesTotalBalanceInUsdMemory[currentNetwork],
    //   currentNetwork,
    // );
    const fetchData = async () => {
      const dataExist =
        cachedAddressesTotalBalanceInUsdRef.current &&
        cachedAddressesTotalBalanceInUsdRef.current[currentNetwork] &&
        Object.keys(cachedAddressesTotalBalanceInUsdRef.current[currentNetwork]).length > 0;
      if (dataExist) {
        setAddressesTotalBalanceInUsd(cachedAddressesTotalBalanceInUsdRef.current[currentNetwork]);
      } else {
        setAddressesTotalBalanceInUsd(cachedAddressesTotalBalanceInUsdMemory[currentNetwork]);
        const result = await getTokensInfo();
        setAddressesTotalBalanceInUsd(result);
      }
    };

    fetchData();
  }, [addresses, currentNetwork, getTokensInfo]);

  return {
    getTokensInfo,
    addressesTotalBalanceInUsd,
  };
};
