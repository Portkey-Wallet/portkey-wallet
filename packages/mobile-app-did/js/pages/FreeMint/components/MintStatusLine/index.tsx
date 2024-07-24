import { FreeMintStatus } from '@portkey-wallet/types/types-ca/freeMint';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { FreeMintStep, showFreeMintModal } from '../FreeMintModal';
import navigationService from 'utils/navigationService';
export interface MintStatus {
  recentStatus: FreeMintStatus;
  itemId: string;
}
const MintStatusLine = (props: MintStatus) => {
  const { recentStatus, itemId } = props;
  const info = useMemo(() => {
    if (recentStatus === FreeMintStatus.PENDING) {
      return {
        title: 'Your NFT is being minted.',
        buttonText: 'View',
      };
    } else if (recentStatus === FreeMintStatus.FAIL) {
      return {
        title: 'Mint failed.',
        buttonText: 'Try Again',
      };
    }
    return {
      title: 'Mint NFTs for free!',
      buttonText: 'Mint Now',
    };
  }, [recentStatus]);
  const handleClickMint = useCallback(() => {
    navigationService.navigate('FreeMintHome', { recentStatus: recentStatus });
    if (recentStatus === FreeMintStatus.FAIL) {
      showFreeMintModal(itemId, FreeMintStep.mintNft);
    } else if (recentStatus === FreeMintStatus.PENDING) {
      showFreeMintModal(itemId, FreeMintStep.mintResult);
    }
  }, [itemId, recentStatus]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{info.title}</Text>
      <Touchable onPress={handleClickMint}>
        <View style={styles.mintNowContainer}>
          <Text style={styles.mintNowText}>{info.buttonText}</Text>
          <Svg icon="right-arrow" color={defaultColors.brandNormal} size={pTd(14)} />
        </View>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: pTd(16),
    marginRight: pTd(16),
    paddingLeft: pTd(12),
    paddingRight: pTd(12),
    paddingTop: pTd(13),
    paddingBottom: pTd(13),
    width: screenWidth - pTd(32),
    backgroundColor: defaultColors.neutralContainerBG,
    borderRadius: pTd(8),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#101114',
    fontSize: pTd(14),
    fontWeight: '500',
    lineHeight: pTd(22),
  },
  mintNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mintNowText: {
    color: '#5D42FF',
    fontSize: pTd(14),
    fontWeight: '500',
    lineHeight: pTd(22),
  },
});

export default MintStatusLine;
