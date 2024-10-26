import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { TReceiveFromNetworkItem } from '@portkey-wallet/types/types-ca/receive';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { makeStyles } from '@rneui/themed';
import CommonAvatar from 'components/CommonAvatar';
import Svg from 'components/Svg';
import ExchangeTabSwitch from './ExchangeTabSwitch';

export default function ReceiveByPortkey({
  sourceChain,
  destinationChain,
}: {
  sourceChain: TReceiveFromNetworkItem;
  destinationChain: IChainItemType;
}) {
  const styles = getStyles();
  const isSupportExchange = useMemo(() => {
    return sourceChain.network === 'AELF' && destinationChain.chainId === 'AELF';
  }, [destinationChain.chainId, sourceChain.network]);

  const onExchangeTabSelected = useCallback(() => {
    console.log('onExchangeTabSelected');
  }, []);

  return (
    <View style={styles.container}>
      {isSupportExchange && <ExchangeTabSwitch isExchangeSelected={true} onSelected={onExchangeTabSelected} />}
      <Text>{sourceChain.network}</Text>
      <Text>{destinationChain.chainId}</Text>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    marginTop: pTd(24),
  },
}));
