import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useReceive } from '@portkey-wallet/hooks/hooks-ca/receive';
import SourceDestinationPicker from '../components/SourceDestinationPicker';
import WalletConnect from '../components/WalletConnect';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';

export default function Receive() {
  const { t } = useLanguage();
  const tokenItem = useRouterParams<TokenItemShowType>();
  const { chainId, symbol } = tokenItem;
  const { loading, errorMsg, destinationChain, destinationChainList, sourceChain, sourceChainList } = useReceive(
    tokenItem,
    chainId,
  );

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
    // todo_wade
  }, []);
  const showDestinationList = useCallback(() => {
    // todo_wade
  }, []);

  return (
    <PageContainer
      titleDom={'Receive ' + (tokenItem.label ?? tokenItem.symbol)}
      safeAreaColor={['black']}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      {sourceChain && destinationChain && (
        <SourceDestinationPicker
          sourceChain={sourceChain}
          destinationChain={destinationChain}
          onSourcePress={showSourceList}
          onDestinationPress={showDestinationList}
        />
      )}
      <WalletConnect />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: pTd(16),
  },
});
