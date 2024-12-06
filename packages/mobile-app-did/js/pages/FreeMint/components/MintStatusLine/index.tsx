import { FreeMintStatus } from '@portkey-wallet/types/types-ca/freeMint';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React, { useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { pTd } from 'utils/unit';
import { FreeMintStep } from '../FreeMintModal';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import { makeStyles, useTheme } from '@rneui/themed';
import { MintStatus as MintStatusType } from '../MintStatusSection';
import MinStatusComponent from 'pages/DashBoard/NFTSection/MinStatusComponent';
import GStyles from 'assets/theme/GStyles';
import FastImage from 'react-native-fast-image';
export interface MintStatus {
  recentStatus: FreeMintStatus;
  itemId: string;
  imageUrl: string;
}
const MintStatusLine = (props: MintStatus) => {
  const { recentStatus, itemId, imageUrl } = props;
  const status =
    recentStatus === FreeMintStatus.PENDING
      ? MintStatusType.Minting
      : recentStatus === FreeMintStatus.FAIL
      ? MintStatusType.MintFailed
      : MintStatusType.Minted;
  const styles = getStyles();
  const info = useMemo(() => {
    if (recentStatus === FreeMintStatus.PENDING) {
      return {
        title: 'Minting your NFT...',
        buttonText: 'View',
      };
    } else if (recentStatus === FreeMintStatus.FAIL) {
      return {
        title: 'NFT minting failed. ',
        buttonText: 'Try Again',
      };
    }
    return {
      title: 'Mint NFTs for free!',
      buttonText: 'Mint Now',
    };
  }, [recentStatus]);
  const handleClickMint = useCallback(() => {
    navigationService.navigate('MintProcess', {
      itemId: itemId,
      freeMintStep: FreeMintStep.mintResult,
      mintStatusType: status,
    });
  }, [itemId, status]);
  const { theme } = useTheme();
  return (
    <Touchable onPress={handleClickMint}>
      <View style={styles.container}>
        <MinStatusComponent status={status} />
        <Text style={[styles.text, styles.sGRegularFont]}>{info.title}</Text>
        <View style={GStyles.flex1} />
        <View style={styles.mintNowContainer}>
          {imageUrl && (
            <FastImage
              source={{
                uri: imageUrl,
              }}
              style={styles.imgStyle}
            />
          )}
          <Svg icon="right-arrow" color={theme.colors.iconNeutral3} size={pTd(12)} />
        </View>
      </View>
    </Touchable>
  );
};

const getStyles = makeStyles(theme => ({
  container: {
    marginBottom: pTd(16),
    paddingLeft: pTd(12),
    paddingRight: pTd(12),
    paddingTop: pTd(13),
    paddingBottom: pTd(13),
    width: screenWidth - pTd(32),
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(8),
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
    textAlign: 'left',
    marginLeft: pTd(12),
  },
  sGRegularFont: {
    ...fonts.SGRegularFont,
  },
  mintNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mintNowText: {
    color: '#5D42FF',
    fontSize: pTd(14),
    // fontWeight: '500',
    lineHeight: pTd(22),
    ...fonts.mediumFont,
  },
  imgStyle: {
    width: pTd(24),
    height: pTd(24),
    marginRight: pTd(12),
    borderRadius: pTd(4),
  },
}));
export default MintStatusLine;
