import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
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
    async (props: RequestNetworkTokenDataProps, networkList: TNetworkItem[], isReceiveAndAll = false) => {
      if (
        pastProps.current &&
        pastProps.current.chainId === props.chainId &&
        pastProps.current.network === props.network
      ) {
        return;
      }
      Loading.show();
      try {
        if (isReceiveAndAll) {
          const response = [];
          for (let i = 0; i < networkList.length; i++) {
            const res = await depositService.getTokenListByNetwork({ ...props, network: networkList[i].network });
            response.push(dealWithNetworkAndTokenData(res, [networkList[i]]));
          }
          setNetworkAndTokenData(response.flat());
        } else {
          const res = await depositService.getTokenListByNetwork(props);
          setNetworkAndTokenData(dealWithNetworkAndTokenData(res, networkList));
        }
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
  if (networkList.length <= 1) {
    sortTokens(tokens).forEach(tokenItem => {
      arr.push({
        token: tokenItem,
        network: networkList[0],
      });
    });
  } else {
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
  }
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

export const getFixedChainIdName = (chainId: string) => {
  const isMainChainId = chainId === MAIN_CHAIN_ID;
  return `${isMainChainId ? 'MainChain' : 'SideChain'} ${chainId}`;
};
