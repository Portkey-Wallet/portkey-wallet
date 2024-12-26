import React, { useCallback, useEffect } from 'react';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useReceive } from '@portkey-wallet/hooks/hooks-ca/receive';
import SourceDestinationPicker from '../components/SourceDestinationPicker';
import SourceDestinationSelector, { SourceDestinationTypeEnum } from '../components/SourceDestinationSelector';
import ReceiveByPortkey from '../components/ReceiveByPortkey';
import ReceiveByETransfer from '../components/ReceiveByETransfer';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { ReceiveType } from '@portkey-wallet/types/types-ca/receive';
import { makeStyles } from '@rneui/themed';
import EBridgeCard from '../components/EBridgeCard';
import { ChainId } from '@portkey-wallet/types';
import { RECEIVE_HELP_URL } from 'constants/common';
import { openOutLink } from 'utils/link';

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
      return { name: item.name, icon: item.imageUrl, key: item.name };
    });
    const selected = sourceList.find(item => item.name === sourceChain?.name);
    SourceDestinationSelector.showList({
      type: SourceDestinationTypeEnum.Source,
      title: 'Source network',
      list: sourceList,
      selectedIndex: selected?.key || '',
      onSelected: (_, key) => {
        setSourceChain(sourceChainList.find(item => item.name === key));
      },
    });
  }, [setSourceChain, sourceChain?.name, sourceChainList]);

  const showDestinationList = useCallback(() => {
    const destinationList = destinationChainList.map(item => {
      return { name: formatChainInfoToShow(item?.chainId), icon: item?.chainImageUrl || '', key: item?.chainId || '' };
    });
    const selected = destinationList.find(item => item?.key === destinationChain?.chainId);
    SourceDestinationSelector.showList({
      type: SourceDestinationTypeEnum.Destination,
      title: 'Destination network',
      list: destinationList,
      selectedIndex: selected?.key || '',
      onSelected: (_, key) => {
        updateDestinationChain(destinationChainList.find(item => item?.chainId === key));
      },
    });
  }, [destinationChain?.chainId, destinationChainList, updateDestinationChain]);

  return (
    <PageContainer
      titleDom={'Receive ' + (tokenInfo.label ?? tokenInfo.symbol)}
      safeAreaColor={['black']}
      rightDom={
        <Touchable
          onPress={async () => {
            await openOutLink(RECEIVE_HELP_URL);
          }}>
          <Svg icon="question" size={pTd(24)} iconStyle={styles.rightIcon} />
        </Touchable>
      }
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

const getStyles = makeStyles(() => ({
  containerStyles: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: pTd(16),
  },
  rightIcon: {
    marginRight: pTd(16),
  },
}));
