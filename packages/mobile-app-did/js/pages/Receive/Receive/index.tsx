import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { TextM, TextS } from 'components/CommonText';
import AccountCard from 'pages/Receive/components/AccountCard';
import { StyleSheet, Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useReceive } from '@portkey-wallet/hooks/hooks-ca/receive';
import SourceDestinationPicker from '../components/SourceDestinationPicker';
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
