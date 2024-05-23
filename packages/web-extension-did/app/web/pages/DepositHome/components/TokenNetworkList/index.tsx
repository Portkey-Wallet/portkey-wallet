import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import './index.less';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { List } from 'antd';
import NetworkLogo from '../NetworkLogo';
import { NetworkStatus, TExtendedTokenItem, TNetworkItem, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import { ChainId } from '@portkey/provider-types';
import depositService from '@portkey-wallet/utils/deposit';
import { useLoading } from 'store/Provider/hooks';
import { singleMessage } from '@portkey/did-ui-react';
import { handleErrorMessage } from '@portkey-wallet/utils';
import CommonHeader, { CustomSvgPlaceholderSize } from 'components/CommonHeader';

export interface ITokenNetworkListProps {
  onClose?: () => void;
  onMoreClicked?: () => void;
  onItemClicked?: (item: TExtendedTokenItem) => void;
  drawerType: 'from' | 'to';
  type?: 'component' | 'page';
  networkList?: TNetworkItem[];
  network?: TNetworkItem | undefined;
  networkListSize?: number;
  toChainIdList?: ChainId[];
  toChainId?: ChainId | undefined;
  token?: TTokenItem | undefined;
}
const ALL_MARK = 'All';
const ALL_INDEX = 0;
function TokenNetworkList(pros: ITokenNetworkListProps) {
  console.log(pros);
  const {
    drawerType,
    type = 'component',
    networkList = [],
    network,
    networkListSize = 0,
    toChainIdList = [],
    toChainId,
    onItemClicked,
    onMoreClicked,
    onClose,
  } = pros;
  const headerTitle = useMemo(
    () => (drawerType === 'from' ? 'Select Pay Token' : 'Select Receive Token'),
    [drawerType],
  );
  const { setLoading } = useLoading();
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState<number>(1);
  const [currentTokenList, setCurrentTokenList] = useState<TExtendedTokenItem[]>([]);
  console.log('wfs===currentTokenList', currentTokenList);
  const showNetworkList = useMemo(() => {
    if (drawerType === 'from') {
      let copiedNetworkList = [...networkList];
      copiedNetworkList?.unshift({
        network: ALL_MARK,
        name: ALL_MARK,
        multiConfirm: '',
        multiConfirmTime: '',
        contractAddress: '',
        explorerUrl: '',
        status: NetworkStatus.Health,
      });
      copiedNetworkList = copiedNetworkList.map((item) => ({
        ...item,
        name: item.name.replace(/\(.*?\)/g, '').trim(),
      }));
      return copiedNetworkList;
    } else {
      const copiedToChainIdList = toChainIdList.map((item) => ({
        name: `${item === 'AELF' ? 'MainChain' : 'SideChain'} ${item}`,
        network: item as string,
        multiConfirm: '',
        multiConfirmTime: '',
        contractAddress: '',
        explorerUrl: '',
        status: NetworkStatus.Health,
      }));
      copiedToChainIdList?.unshift({
        network: ALL_MARK,
        name: ALL_MARK,
        multiConfirm: '',
        multiConfirmTime: '',
        contractAddress: '',
        explorerUrl: '',
        status: NetworkStatus.Health,
      });
      // const selectedIndex = copiedToChainIdList.findIndex((item) => item.network === toChainId);
      // setSelectedNetworkIndex(selectedIndex);
      return copiedToChainIdList;
    }
  }, [drawerType, networkList, toChainIdList]);
  console.log('wfs showNetworkList===', showNetworkList);
  const { isPrompt } = useCommonState();
  console.log('isPrompt====', isPrompt);
  const headerEle = useMemo(() => {
    return <CommonHeader title={headerTitle} onLeftBack={onClose} />;
  }, [headerTitle, onClose]);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const tokenList = await depositService.getTokenListByNetwork({
          type: drawerType,
          network: drawerType === 'from' ? network?.network : toChainId,
          chainId: toChainId || 'AELF',
        });
        const updatedTokenList = tokenList
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ networkList, ...rest }) => rest)
          .map((item) => ({
            ...item,
            network:
              drawerType === 'from'
                ? { ...network }
                : {
                    name: `${toChainId === 'AELF' ? 'MainChain' : 'SideChain'} ${toChainId}`,
                    network: toChainId as string,
                    multiConfirm: '',
                    multiConfirmTime: '',
                    contractAddress: '',
                    explorerUrl: '',
                    status: NetworkStatus.Health,
                  },
          }));
        // const updatedTokenList = { ...tempUpdatedTokenList, network: { ...network } };
        setCurrentTokenList(updatedTokenList as TExtendedTokenItem[]);
      } catch (error) {
        console.log('aaaa error : ', error);
        singleMessage.error(handleErrorMessage(error));
      } finally {
        setLoading(false);
      }
    })();
  }, [drawerType, network, network?.network, setLoading, toChainId]);
  const handleNetworkChange = useCallback(
    async (item: TNetworkItem, index: number) => {
      try {
        setLoading(true);
        const tokenList = await depositService.getTokenListByNetwork({
          type: drawerType,
          network: item.network === ALL_MARK ? undefined : item.network,
          chainId: item.network === ALL_MARK ? undefined : toChainId || 'AELF',
        });
        console.log('wfs setSelectedNetworkIndex invoke2', index);
        setSelectedNetworkIndex(index);
        if (item.network === ALL_MARK) {
          const tokenListForAll: TExtendedTokenItem[] = [];
          tokenList.forEach((item) => {
            const { networkList, ...rest } = item;
            const divideArray = networkList?.map((item) => ({ ...rest, network: { ...item } })) || [];
            tokenListForAll.push(...divideArray);
          });
          setCurrentTokenList(tokenListForAll);
        } else {
          // const tempUpdatedTokenList = tokenList.map(({ networkList, ...rest }) => rest);
          const updatedTokenList = tokenList
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ networkList, ...rest }) => rest)
            .map((inItem) => ({
              ...inItem,
              network:
                drawerType === 'from'
                  ? { ...item }
                  : {
                      name: `${item.network === 'AELF' ? 'MainChain' : 'SideChain'} ${item.network}`,
                      network: item.network as string,
                      multiConfirm: '',
                      multiConfirmTime: '',
                      contractAddress: '',
                      explorerUrl: '',
                      status: NetworkStatus.Health,
                    },
            }));
          // cons
          // const updatedTokenList = { ...tempUpdatedTokenList, network: { ...item } };
          setCurrentTokenList(updatedTokenList as TExtendedTokenItem[]);
        }
      } catch (error) {
        console.log('aaaa error : ', error);
        singleMessage.error(handleErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [drawerType, setLoading, toChainId],
  );
  console.log('wfs selectedNetworkIndex===', selectedNetworkIndex);
  const selectNetworkEle = useMemo(() => {
    return (
      <div className="select-network-container">
        <span className="select-network">Select Network</span>
        <div className="all">
          {showNetworkList.map((item, index) => (
            <button
              key={index}
              className={`all-button network-button ${
                selectedNetworkIndex === index ? 'network-button-selected' : 'network-button-unselected'
              }`}
              onClick={() => {
                console.log('wfs click showNetworkList', item, index);
                handleNetworkChange(item, index);
              }}>
              {item.name !== ALL_MARK && <NetworkLogo network={item.network} />}
              <span className="all-span">{item.name}</span>
            </button>
          ))}
          {drawerType === 'from' && networkListSize > 2 && (
            <button
              className="network-more-button network-button network-button-unselected"
              onClick={() => {
                console.log('wfs onMoreClicked===');
                onMoreClicked?.();
              }}>
              <span className="network-more-count">{networkListSize - 2}+</span>
            </button>
          )}
        </div>
      </div>
    );
  }, [showNetworkList, drawerType, networkListSize, selectedNetworkIndex, handleNetworkChange, onMoreClicked]);
  const selectTokenEle = useMemo(() => {
    return (
      <div className="select-token-container">
        <div className="select-token-title">
          <span className="select-token">Select Token</span>
        </div>
        {currentTokenList.length !== 0 && (
          <List
            className="token-list"
            dataSource={currentTokenList}
            renderItem={(token) => {
              console.log('wfs ====render token', token);
              return (
                <List.Item
                  onClick={() => {
                    console.log('click item!!', token);
                    onItemClicked?.(token);
                  }}>
                  <div className="item-container">
                    <div className="item-wrapper">
                      <div className="icon-wrapper">
                        <img src={token.icon} alt="TokenSymbol" width="36" height="36" />
                        {selectedNetworkIndex === ALL_INDEX && (
                          <div className="network-icon-container">
                            <NetworkLogo network={token.network?.network} />
                          </div>
                        )}
                      </div>
                      <div className="token-info-container">
                        <div className="token-info-name-container">
                          <span className="token-name">{token.symbol}</span>
                          <span className="token-full-name">{token.name}</span>
                        </div>
                        <span className="token-address">
                          {token.network ? token.network.contractAddress : token.contractAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </div>
    );
  }, [currentTokenList, onItemClicked, selectedNetworkIndex]);
  const mainContent = useCallback(() => {
    return (
      <div className="select-token-network-list">
        {headerEle}
        <div className="body">
          {selectNetworkEle}
          {selectTokenEle}
        </div>
      </div>
    );
  }, [headerEle, selectNetworkEle, selectTokenEle]);
  return <>{isPrompt && type === 'page' ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
export default memo(TokenNetworkList, (prev, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClose, onItemClicked, onMoreClicked, ...resetPrev } = prev;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClose: onClose2, onItemClicked: onItemClicked2, onMoreClicked: onMoreClicked2, ...resetNext } = next;
  console.log('resetPrev', JSON.stringify(resetPrev));
  console.log('resetNext', JSON.stringify(resetNext));
  return JSON.stringify(resetPrev) === JSON.stringify(resetNext);
});
