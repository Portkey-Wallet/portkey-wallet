import useToken from '@portkey-wallet/hooks/hooks-eoa/useToken';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { ReceiveListPureComponent } from '@portkey/did-ui-react';
import { useNavigate } from 'react-router';
import { ChainId } from '@portkey-wallet/types';
import useDebounce from 'hooks/useDebounce';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_IN_ACCOUNT_ASSETS } from '@portkey-wallet/constants/constants-eoa/assets';
import { useEffectOnce, useLatestRef } from '@portkey-wallet/hooks';
import { request } from '@portkey-wallet/api/api-did';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-eoa/token';
import './index.less';
import { useAccountTokenInfoMixLocalShowToken } from '@portkey-wallet/hooks/hooks-eoa/assets';

export interface BaseToken {
  id?: string; // id
  chainId: ChainId;
  decimals: number | string;
  address: string; // token  contract address
  symbol: string;
  label?: string;
  imageUrl?: string;
  chainImageUrl?: string;
  isNFT?: boolean;
}
export default function ReceiveList() {
  const { totalRecordCount, fetchTokenInfoList } = useToken();
  const _tokenDataShowInMarket = useAccountTokenInfoMixLocalShowToken();

  const tokenDataShowInMarket = useMemo(() => _tokenDataShowInMarket || [], [_tokenDataShowInMarket]);
  const [filteredShowList, setFilteredShowList] = useState<IUserTokenItemResponse[]>([]);
  const chainIdList = useChainIdList();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword, 800);
  const [isLoading, setIsLoading] = useState(true);
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const getTokenList = useLockCallback(
    async (init?: boolean) => {
      try {
        if (debounceKeyword.trim()) {
          return;
        }
        if (totalRecordCount && tokenDataShowInMarket?.length >= totalRecordCount && !init) {
          return;
        }

        await fetchTokenInfoList({
          keyword: '',
          chainIdArray: chainIdList,
          skipCount: init ? 0 : tokenDataShowInMarket?.length,
          maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [chainIdList, debounceKeyword, fetchTokenInfoList, tokenDataShowInMarket?.length, totalRecordCount],
  );
  const getTokenListLatest = useLatestRef(getTokenList);
  useEffectOnce(() => {
    getTokenListLatest.current(true);
  });
  const getTokenListWithKeyword = useLockCallback(async () => {
    if (!debounceKeyword.trim()) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await request.token.fetchTokenListBySearchV2({
        params: {
          symbol: debounceKeyword.trim(),
          chainIds: chainIdList,
          version: '1.11.1',
          skipCount: 0,
          maxResultCount: PAGE_SIZE_DEFAULT,
        },
      });
      setFilteredShowList(res?.data);
    } catch (error) {
      setFilteredShowList([]);
      console.log('fetchTokenListByFilter error', error);
    } finally {
      setIsLoading(false);
    }
  }, [chainIdList, debounceKeyword]);

  useEffect(() => {
    if (debounceKeyword.trim()) {
      getTokenListWithKeyword();
    } else {
      setFilteredShowList([]);
    }
  }, [chainIdList, debounceKeyword, getTokenListWithKeyword]);
  const mainContent = useMemo(
    () => (
      <ReceiveListPureComponent
        onBack={() => {
          navigate('/');
        }}
        onInputChange={onInputChange}
        isLoading={isLoading}
        currentTokenList={(debounceKeyword ? filteredShowList : tokenDataShowInMarket) as any}
        onItemClick={function (item: any): void {
          navigate('/receive-card', {
            state: item,
          });
        }}
      />
    ),
    [debounceKeyword, filteredShowList, isLoading, navigate, tokenDataShowInMarket],
  );
  return <>{mainContent}</>;
}
