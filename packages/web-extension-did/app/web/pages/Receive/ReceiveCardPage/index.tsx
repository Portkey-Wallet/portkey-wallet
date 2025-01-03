import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import {
  CustomSvg,
  formatStr2EllipsisStr,
  PortkeyStyleProvider,
  ReceiveCardPureComponent,
  singleMessage,
} from '@portkey/did-ui-react';
import { useLocationState } from 'hooks/router';
import { useReceive, useReceiveByETransfer } from '@portkey-wallet/hooks/hooks-ca/receive';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChainId } from '@portkey/provider-types';
import { ChainInfo, ReceiveType, TDepositInfo, TReceiveFromNetworkItem } from '@portkey/services';
import { useCurrentCaInfo, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getManagerAccount, getPin } from 'store/utils/getStore';
import { CAInfo } from '@portkey/did';
import './index.less';
import { QRCodeDataObjType, shrinkSendQrData } from '@portkey-wallet/utils/qrCode';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';

enum CHAIN_ID {
  AELF = 'AELF',
  tDVV = 'tDVV',
  tDVW = 'tDVW',
}
enum SELECTION_TYPE {
  SOURCE = 'Source',
  DESITNATION = 'Destination',
  NFT = 'NFT',
}
type NetworkItem = {
  imageUrl: string;
  chainId: ChainId;
  name: string;
  key: string;
};
export type TokenItem = TReceiveFromNetworkItem | ChainInfo | NetworkItem;

const NETWORK_LIST: NetworkItem[] = [
  {
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/dappChain.png',
    chainId: CHAIN_ID.tDVW,
    name: 'aelf dAppChain',
    key: 'aelf dAppChain',
  },
  {
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/mainChain.png',
    chainId: CHAIN_ID.tDVV,
    name: 'aelf MainChain',
    key: 'aelf MainChain',
  },
];
const getNetworkList = (isMainnet: boolean) => {
  NETWORK_LIST.forEach((item) => {
    if (item.key === 'aelf dAppChain') {
      item.chainId = isMainnet ? 'tDVV' : 'tDVW';
    } else {
      item.chainId = 'AELF';
    }
  });
  return NETWORK_LIST;
};
export default function ReceiveCardMain() {
  const navigate = useNavigate();
  const { state: selectToken } = useLocationState<
    IUserTokenItemResponse & {
      isNFT: boolean;
    }
  >();
  const chainId = useMemo(() => (selectToken.symbol === 'ELF' ? MAIN_CHAIN_ID : undefined), [selectToken.symbol]);
  const {
    loading,
    errorMsg,
    receiveType,
    destinationChain,
    destinationChainList,
    updateDestinationChain,
    sourceChain,
    sourceChainList,
    setSourceChain,
  } = useReceive(selectToken, chainId);
  // useEffect(() => {
  //   if (loading) {
  //     setLoading(true);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [loading]);
  useEffect(() => {
    if (errorMsg && errorMsg.length) {
      singleMessage.error(errorMsg);
    }
  }, [errorMsg]);

  const [isExchangeSelected, setIsExchangeSelected] = useState(selectToken.symbol === 'ELF');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<TReceiveFromNetworkItem>();
  const [selectedDestination, setSelectedDestination] = useState<ChainInfo | undefined>();
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isReceivedExchangeModalOpen, setIsReceivedExchangeModalOpen] = useState(false);
  const [currentDepositInfo, setCurrentDepositInfo] = useState<TDepositInfo>();
  const caInfo = useCurrentCaInfo();
  const currentWallet = useCurrentWalletInfo();
  const { chainType } = useCurrentNetwork();
  const currentNetWork = useCurrentNetworkInfo();
  const isMainnet = useIsMainnet();
  const currentCaAddress = currentWallet?.[destinationChain?.chainId || 'AELF']?.caAddress;
  const toCaAddress = useMemo(
    () => `ELF_${currentCaAddress}_${destinationChain?.chainId || 'AELF'}`,
    [currentCaAddress, destinationChain?.chainId],
  );

  const { loading: eTransferLoading, depositInfo } = useReceiveByETransfer({
    manager: getManagerAccount(getPin() ?? ''),
    toChainId: destinationChain?.chainId as ChainId,
    toSymbol: selectToken.symbol,
    fromNetwork: selectedSource?.network || '',
    fromSymbol: selectToken.symbol,
    // receiveType,
  });

  const isMainChainToMainChain =
    selectedSource?.network === MAIN_CHAIN_ID && selectedDestination?.chainId === MAIN_CHAIN_ID;

  useEffect(() => {
    if (depositInfo) {
      setCurrentDepositInfo(depositInfo);
    }
  }, [depositInfo]);

  useEffect(() => {
    if (sourceChain) {
      setSelectedSource(sourceChain);
    }

    if (destinationChain) {
      setSelectedDestination(destinationChain as ChainInfo);
    }

    if (isMainChainToMainChain && !selectToken.isNFT && selectToken.symbol === 'ELF') {
      setIsReceivedExchangeModalOpen(true);
    }
  }, [sourceChain, destinationChain, isMainChainToMainChain, selectToken.isNFT, selectToken.symbol]);

  const showExchangeTip = useMemo(
    () =>
      selectToken?.symbol === 'ELF' &&
      sourceChain?.network === MAIN_CHAIN_ID &&
      destinationChain?.chainId !== MAIN_CHAIN_ID,
    [destinationChain?.chainId, selectToken?.symbol, sourceChain?.network],
  );

  const onSelectedChange = useCallback(
    (item: any) => {
      if (selectedType === SELECTION_TYPE.SOURCE) {
        setSourceChain(item as TReceiveFromNetworkItem);
        setSelectedSource(item as TReceiveFromNetworkItem);
        return;
      }
      if (selectedType === SELECTION_TYPE.NFT) {
        setSourceChain(item as TReceiveFromNetworkItem);
        updateDestinationChain(item as ChainInfo);
        return;
      }
      if (selectedType === SELECTION_TYPE.DESITNATION) {
        setSelectedDestination(item as ChainInfo);
        updateDestinationChain(item as ChainInfo);
      }
    },
    [selectedType, setSourceChain, updateDestinationChain],
  );

  const renderSelected = useCallback(
    (item: any) => {
      const selection = (
        <div className="icon-wrapper">
          <CustomSvg type="Check" fillColor="var(--sds-color-background-default-default)" className="selected-icon" />
        </div>
      );

      if (selectedType === SELECTION_TYPE.SOURCE) {
        if (selectedSource === item) {
          return selection;
        }
      } else {
        if (
          selectedDestination === item ||
          (selectToken.isNFT && selectedDestination?.displayChainName === (item as NetworkItem).name)
        ) {
          return selection;
        }
      }

      return null;
    },
    [selectToken.isNFT, selectedDestination, selectedSource, selectedType],
  );

  const renderSelectionList = useMemo(() => {
    if (selectedType === SELECTION_TYPE.NFT) {
      return getNetworkList(isMainnet);
    }
    if (selectedType === SELECTION_TYPE.SOURCE) {
      return sourceChainList;
    }

    return (destinationChainList as ChainInfo[]) || [];
  }, [destinationChainList, isMainnet, selectedType, sourceChainList]);

  const renderTip = useCallback(() => {
    if (selectToken.isNFT) {
      return (
        <span>
          Use this address to receive assets on the <span className="chain">{selectedSource?.name}</span>
        </span>
      );
    }

    if (isMainChainToMainChain && isExchangeSelected) {
      return (
        <span>
          Send {selectToken.symbol} on <span className="chain">{selectedSource?.name}</span> from exchange to this
          address and receive on the <span className="chain">{destinationChain?.displayChainName}</span>
        </span>
      );
    }

    if (receiveType === ReceiveType.ETransfer) {
      return (
        <span>
          Send {selectToken.symbol} on <span className="chain">{selectedSource?.name}</span> to this address and receive
          on the <span className="chain">{selectedDestination?.displayChainName}</span>. Transfers from both exchange
          and non-exchange addresses are accepted.
        </span>
      );
    }

    return (
      <span>
        Send {selectToken.symbol} on <span className="chain">{selectedSource?.name}</span> to this address and receive
        on the <span className="chain">{selectedDestination?.displayChainName}</span>.
      </span>
    );
  }, [
    destinationChain?.displayChainName,
    isExchangeSelected,
    isMainChainToMainChain,
    receiveType,
    selectToken.isNFT,
    selectToken.symbol,
    selectedDestination?.displayChainName,
    selectedSource?.name,
  ]);
  const tokenItem = useMemo(() => {
    return selectToken.tokens?.find((item) => item.chainId === destinationChain?.chainId);
  }, [destinationChain?.chainId, selectToken.tokens]);
  const generateAddress = useCallback(() => {
    const address = caInfo?.[destinationChain?.chainId as ChainId]?.caAddress;
    if (currentDepositInfo && selectedSource && !Object.keys(CHAIN_ID).includes(selectedSource?.network)) {
      return {
        value: currentDepositInfo.depositAddress,
        label: formatStr2EllipsisStr(currentDepositInfo.depositAddress, [6, 4]),
      };
    }

    if (selectToken.isNFT && selectedSource) {
      const network = selectedDestination ? selectedDestination?.chainId : selectedSource?.network;
      return {
        value: `ELF_${address}_${network}`,
        label: `ELF_${formatStr2EllipsisStr(address, [4, 4])}_${network}`,
      };
    }

    if (address && selectedDestination) {
      if (
        isMainChainToMainChain ||
        !(selectedDestination && Object.keys(CHAIN_ID).includes(selectedDestination?.chainId))
      ) {
        if (isExchangeSelected) {
          return {
            value: address,
            label: formatStr2EllipsisStr(address, [6, 4]),
          };
        }
      }
      const info: QRCodeDataObjType = {
        address: toCaAddress,
        networkType: currentNetWork.networkType,
        chainType,
        type: 'send',
        toInfo: {
          name: '',
          address: toCaAddress,
        },
        assetInfo: {
          symbol: selectToken?.symbol,
          label: selectToken.label,
          tokenContractAddress: tokenItem?.tokenContractAddress || tokenItem?.address || '',
          chainId: tokenItem?.chainId || destinationChain?.chainId,
          decimals: tokenItem?.decimals || 0,
        },
      };
      return {
        value: JSON.stringify(shrinkSendQrData(info)),
        addressValue: toCaAddress,
        label: `ELF_${formatStr2EllipsisStr(address, [4, 4])}_${selectedDestination.chainId}`,
      };
      // return {
      //   value: `ELF_${address}_${selectedDestination.chainId}`,
      //   label: `ELF_${formatStr2EllipsisStr(address, [4, 4])}_${selectedDestination.chainId}`,
      // };
    }
    return {
      value: '',
      label: '',
    };
  }, [
    caInfo,
    chainType,
    currentDepositInfo,
    currentNetWork.networkType,
    destinationChain?.chainId,
    isExchangeSelected,
    isMainChainToMainChain,
    selectToken.isNFT,
    selectToken.label,
    selectToken?.symbol,
    selectedDestination,
    selectedSource,
    toCaAddress,
    tokenItem?.address,
    tokenItem?.chainId,
    tokenItem?.decimals,
    tokenItem?.tokenContractAddress,
  ]);
  const mainContent = useMemo(
    () => (
      <PortkeyStyleProvider>
        <ReceiveCardPureComponent
          onBack={() => {
            navigate(-1);
          }}
          selectToken={selectToken}
          setSelectedType={setSelectedType}
          setIsSelectionModalOpen={setIsSelectionModalOpen}
          selectedDestination={selectedDestination}
          selectedSource={selectedSource}
          loading={loading}
          eTransferLoading={eTransferLoading}
          isMainChainToMainChain={isMainChainToMainChain}
          isExchangeSelected={isExchangeSelected}
          setIsExchangeSelected={setIsExchangeSelected}
          generateAddress={generateAddress}
          caInfo={
            caInfo as
              | {
                  [key: string]: CAInfo;
                }
              | undefined
          }
          destinationChain={destinationChain as ChainInfo}
          receiveType={receiveType}
          currentDepositInfo={currentDepositInfo}
          renderTip={renderTip}
          showExchangeTip={showExchangeTip}
          isSelectionModalOpen={isSelectionModalOpen}
          selectedType={selectedType}
          renderSelectionList={renderSelectionList}
          onSelectedChange={onSelectedChange}
          renderSelected={renderSelected}
          isReceivedExchangeModalOpen={isReceivedExchangeModalOpen}
          setIsReceivedExchangeModalOpen={setIsReceivedExchangeModalOpen}
        />
      </PortkeyStyleProvider>
    ),
    [
      caInfo,
      currentDepositInfo,
      destinationChain,
      eTransferLoading,
      generateAddress,
      isExchangeSelected,
      isMainChainToMainChain,
      isReceivedExchangeModalOpen,
      isSelectionModalOpen,
      loading,
      navigate,
      onSelectedChange,
      receiveType,
      renderSelected,
      renderSelectionList,
      renderTip,
      selectToken,
      selectedDestination,
      selectedSource,
      selectedType,
      showExchangeTip,
    ],
  );
  // return (
  //   <PortkeyStyleProvider>
  //     <ReceiveCardPureComponent
  //       onBack={() => {
  //         navigate(-1);
  //       }}
  //       selectToken={selectToken}
  //       setSelectedType={setSelectedType}
  //       setIsSelectionModalOpen={setIsSelectionModalOpen}
  //       selectedDestination={selectedDestination}
  //       selectedSource={selectedSource}
  //       loading={loading}
  //       eTransferLoading={eTransferLoading}
  //       isMainChainToMainChain={isMainChainToMainChain}
  //       isExchangeSelected={isExchangeSelected}
  //       setIsExchangeSelected={setIsExchangeSelected}
  //       generateAddress={generateAddress}
  //       caInfo={
  //         caInfo as
  //           | {
  //               [key: string]: CAInfo;
  //             }
  //           | undefined
  //       }
  //       destinationChain={destinationChain as ChainInfo}
  //       receiveType={receiveType}
  //       currentDepositInfo={currentDepositInfo}
  //       renderTip={renderTip}
  //       showExchangeTip={showExchangeTip}
  //       isSelectionModalOpen={isSelectionModalOpen}
  //       selectedType={selectedType}
  //       renderSelectionList={renderSelectionList}
  //       onSelectedChange={onSelectedChange}
  //       renderSelected={renderSelected}
  //       isReceivedExchangeModalOpen={isReceivedExchangeModalOpen}
  //       setIsReceivedExchangeModalOpen={setIsReceivedExchangeModalOpen}
  //     />
  //   </PortkeyStyleProvider>
  // );
  return <>{mainContent}</>;
}
