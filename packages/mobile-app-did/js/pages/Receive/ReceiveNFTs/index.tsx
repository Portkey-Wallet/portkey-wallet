import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import { SourceDestinationItem } from '../components/SourceDestinationPicker';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { makeStyles } from '@rneui/themed';
import { SEND_RECEIVE_HELP_URL } from 'constants/common';
import { openOutLink } from 'utils/link';
import ModeChangeSelector from 'pages/DashBoard/componets/ModeChangeSelector';
import ReceiveQRCode from '../components/ReceiveQRCode';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetwork as useCurrentNetworkType } from '@portkey-wallet/hooks/hooks-ca/network';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';

const networkList = [
  {
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/dappChain.png',
    name: 'aelf dAppChain',
    key: 'aelf dAppChain',
  },
  {
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/mainChain.png',
    name: 'aelf MainChain',
    key: 'aelf MainChain',
  },
];

export default function ReceiveNFTs() {
  const styles = getStyles();
  const [destinationChain, setDestinationChain] = useState(networkList[0]);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(networkList[0].key);
  const currentWallet = useCurrentWalletInfo();
  const currentNetworkType = useCurrentNetworkType();
  const destinationChainId =
    destinationChain.key === 'aelf dAppChain' ? (currentNetworkType === 'MAINNET' ? 'tDVV' : 'tDVW') : 'AELF';
  const currentCaAddress = currentWallet?.[destinationChainId]?.caAddress;
  const toCaAddress = useMemo(
    () => `ELF_${currentCaAddress}_${destinationChainId}`,
    [currentCaAddress, destinationChainId],
  );

  const qrcodeAddress = useMemo(() => {
    return toCaAddress;
  }, [toCaAddress]);

  const showDestinationList = useCallback(() => {
    ModeChangeSelector.showList({
      list: networkList,
      selectedIndex: currentSelectedIndex,
      iconSize: 20,
      isShowRightCloseIcon: true,
      title: 'Network',
      onSelected: (_item, key) => {
        const currentSourceChain = networkList.find(item => item.key === key);
        currentSourceChain && setDestinationChain(currentSourceChain);
        currentSourceChain && setCurrentSelectedIndex(currentSourceChain.key);
      },
    });
  }, [currentSelectedIndex]);

  return (
    <PageContainer
      titleDom={'Receive NFTs'}
      safeAreaColor={['black']}
      rightDom={
        <Touchable
          onPress={async () => {
            await openOutLink(SEND_RECEIVE_HELP_URL);
          }}>
          <Svg icon="question" size={pTd(24)} iconStyle={styles.rightIcon} />
        </Touchable>
      }
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.container}>
        <SourceDestinationItem
          title="Network"
          icon={destinationChain.imageUrl}
          chainName={destinationChain.name}
          onPress={showDestinationList}
          containerStyles={styles.selectContainerStyles}
        />
      </View>
      <ReceiveQRCode data={qrcodeAddress} address={qrcodeAddress} />
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
  rightIcon: {
    marginRight: pTd(16),
  },
  selectContainerStyles: {
    flex: 0,
  },
  container: {
    marginTop: pTd(8),
    height: pTd(60),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(8),
    flexDirection: 'column',
    marginBottom: pTd(24),
  },
}));
