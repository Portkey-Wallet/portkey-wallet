import React, { useCallback, useEffect, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useReceive } from '@portkey-wallet/hooks/hooks-ca/receive';
import SourceDestinationPicker from '../components/SourceDestinationPicker';
import SourceDestinationSelector from '../components/SourceDestinationSelector';
import ReceiveByPortkey from '../components/ReceiveByPortkey';
import ReceiveByETransfer from '../components/ReceiveByETransfer';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { ReceiveType } from '@portkey-wallet/types/types-ca/receive';
import { makeStyles } from '@rneui/themed';
import EBridgeCard from '../components/EBridgeCard';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { ChainId } from '@portkey-wallet/types';

export default function Receive() {
  const { tokenInfo, chainId } = useRouterParams<{ tokenInfo: IUserTokenItemResponse; chainId?: ChainId }>();
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
  } = useReceive(tokenInfo, chainId);
  const styles = getStyles();

  useEffect(() => {
    if (loading) {
      Loading.show();
    } else {
      Loading.hide();
    }
  }, [loading]);

  useEffect(() => {
    if (errorMsg && errorMsg.length) {
      CommonToast.fail(errorMsg);
    }
  }, [errorMsg]);

  const showSourceList = useCallback(() => {
    const sourceList = sourceChainList.map(item => {
      return { name: item.name, icon: item.imageUrl };
    });
    const selectedIndex = sourceChainList.findIndex(item => item.name === sourceChain?.name);
    SourceDestinationSelector.showList({
      title: 'Source network',
      list: sourceList,
      selectedIndex,
      onSelected: (_, index) => {
        setSourceChain(sourceChainList[index]);
      },
    });
  }, [setSourceChain, sourceChain?.name, sourceChainList]);

  const showDestinationList = useCallback(() => {
    const destinationList = destinationChainList.map(item => {
      return { name: formatChainInfoToShow(item?.chainId), icon: item?.chainImageUrl || '' };
    });
    const selectedIndex = destinationChainList.findIndex(item => item?.chainId === destinationChain?.chainId);
    SourceDestinationSelector.showList({
      title: 'Destination network',
      list: destinationList,
      selectedIndex,
      onSelected: (_, index) => {
        updateDestinationChain(destinationChainList[index]);
      },
    });
  }, [destinationChain?.chainId, destinationChainList, updateDestinationChain]);

  return (
    <PageContainer
      titleDom={'Receive ' + (tokenInfo.label ?? tokenInfo.symbol)}
      safeAreaColor={['black']}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      {sourceChain && destinationChain && (
        <>
          <SourceDestinationPicker
            sourceChain={sourceChain}
            destinationChain={destinationChain}
            onSourcePress={showSourceList}
            onDestinationPress={showDestinationList}
          />
          {receiveType === ReceiveType.Portkey && (
            <ReceiveByPortkey tokenInfo={tokenInfo} sourceChain={sourceChain} destinationChain={destinationChain} />
          )}
          {receiveType === ReceiveType.ETransfer && (
            <ReceiveByETransfer tokenInfo={tokenInfo} sourceChain={sourceChain} destinationChain={destinationChain} />
          )}
          {receiveType === ReceiveType.EBridge && (
            <EBridgeCard tokenInfo={tokenInfo} destinationChain={destinationChain} sourceChain={sourceChain} />
          )}
        </>
      )}
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: pTd(16),
  },
}));
