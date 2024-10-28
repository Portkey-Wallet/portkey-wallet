import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
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

export default function Receive() {
  const tokenItem = useRouterParams<TokenItemShowType>();
  const { chainId, symbol } = tokenItem;
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
  } = useReceive(tokenItem, chainId);
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
      return { name: formatChainInfoToShow(item?.chainId), icon: '' };
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
      titleDom={'Receive ' + (tokenItem.label ?? tokenItem.symbol)}
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
            <ReceiveByPortkey tokenItem={tokenItem} sourceChain={sourceChain} destinationChain={destinationChain} />
          )}
          {receiveType === ReceiveType.ETransfer && (
            <ReceiveByETransfer tokenItem={tokenItem} sourceChain={sourceChain} destinationChain={destinationChain} />
          )}
          {receiveType === ReceiveType.EBridge && <EBridgeCard tokenInfo={tokenItem} />}
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
