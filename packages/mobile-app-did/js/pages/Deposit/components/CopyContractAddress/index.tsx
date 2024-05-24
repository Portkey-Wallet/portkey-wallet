import React, { useCallback } from 'react';
import { StyleSheet, View, Keyboard, Text, TouchableOpacity } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { TTokenItem, TNetworkItem } from '@portkey-wallet/types/types-ca/deposit';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { defaultColors } from 'assets/theme';

interface CopyDepositAddressProps {
  fromNetwork: TNetworkItem;
  fromToken: TTokenItem;
  contractAddress: string;
  onExplore: () => void;
}

const CopyDepositAddress: React.FC<CopyDepositAddressProps> = ({
  fromNetwork,
  fromToken,
  contractAddress,
  onExplore,
}) => {
  const jumpToWebview = useDiscoverJumpWithNetWork();

  const onDismiss = useCallback(() => {
    OverlayModal.hide(false);
  }, []);

  const jumpToNetwork = useCallback(() => {
    onExplore();
    jumpToWebview({
      item: {
        name: fromNetwork.name,
        url: fromNetwork.explorerUrl,
      },
    });
  }, [fromNetwork, jumpToWebview, onExplore]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{`${fromToken.symbol} Contract Address on ${fromNetwork.name} Network`}</Text>
      <View style={styles.addressWrap}>
        <Text style={styles.addressText}>{contractAddress}</Text>
        <TouchableOpacity>
          <Svg icon={'copy1'} size={pTd(32)} iconStyle={styles.copyButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={jumpToNetwork}>
          <Svg icon={'explore'} size={pTd(20)} iconStyle={styles.exploreButton} />
        </TouchableOpacity>
      </View>
      <CommonButton style={styles.okButton} type="primary" disabled={false} onPress={onDismiss}>
        OK
      </CommonButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    margin: pTd(20),
    backgroundColor: defaultColors.white,
    borderRadius: pTd(8),
    padding: pTd(20),
  },
  titleText: {
    fontSize: pTd(14),
    color: defaultColors.font18,
  },
  addressWrap: {
    marginTop: pTd(16),
    flexDirection: 'row',
  },
  addressText: {
    fontSize: pTd(16),
    color: defaultColors.font5,
    flex: 1,
  },
  copyButton: {
    marginLeft: pTd(12),
  },
  exploreButton: {
    marginLeft: pTd(12),
  },
  okButton: {
    marginTop: pTd(24),
  },
});

export const showCopyDepositAddress = (props: CopyDepositAddressProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<CopyDepositAddress {...props} />, {
    position: 'center',
    animated: false,
  });
};
