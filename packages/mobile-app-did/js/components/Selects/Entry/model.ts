import { ChainId } from '@portkey-wallet/im';
import { TNetworkItem, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import depositService from '@portkey-wallet/utils/deposit';
import Loading from 'components/Loading';
import { useCallback, useRef, useState } from 'react';

export type NetworkAndTokenShowType = Array<TokenWithNetwork>;

export type TokenWithNetwork = {
  token: TTokenItem;
  network: TNetworkItem;
};

export type RequestNetworkTokenDataProps = {
  type: 'from' | 'to';
  network?: string;
  chainId?: ChainId;
};

export const useMemoNetworkAndTokenData = () => {
  const [networkAndTokenData, setNetworkAndTokenData] = useState<NetworkAndTokenShowType>([]);
  const pastProps = useRef<RequestNetworkTokenDataProps | undefined>();
  const updateNetworkAndTokenData = useCallback(
    async (props: RequestNetworkTokenDataProps, networkList: TNetworkItem[]) => {
      if (
        pastProps.current &&
        pastProps.current.chainId === props.chainId &&
        pastProps.current.network === props.network
      ) {
        return;
      }
      Loading.show();
      try {
        const res = await depositService.getTokenListByNetwork(props);
        console.log('res', res);
        setNetworkAndTokenData(dealWithNetworkAndTokenData(res, networkList));
        pastProps.current = props;
      } catch (ignored) {
        console.log('ignored', ignored);
      } finally {
        Loading.hide();
      }
    },
    [],
  );
  return { networkAndTokenData, updateNetworkAndTokenData };
};

const dealWithNetworkAndTokenData = (tokens: TTokenItem[], networkList: TNetworkItem[]) => {
  const arr: NetworkAndTokenShowType = [];
  networkList.forEach(network => {
    sortTokens(tokens).forEach(tokenItem => {
      if (tokenItem.networkList?.some(item => item.network === network.network)) {
        arr.push({
          token: tokenItem,
          network,
        });
      }
    });
  });
  return arr;
};

export const sortTokens = (tokens: TTokenItem[]) => {
  return tokens.sort((a, b) => {
    return getTokenPriority(b) - getTokenPriority(a);
  });
};

const getTokenPriority = (token: TTokenItem) => {
  const { symbol } = token;
  if (symbol === 'USDT') {
    return 100;
  } else if (symbol.indexOf('SGR') !== -1) {
    return 99;
  } else {
    return 1;
  }
};
