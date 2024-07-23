import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import NFTAvatar from 'components/NFTAvatar';
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import StatusIcon from '../StatusIcon';
import { TextM, TextXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import ButtonCol, { ButtonRowProps } from 'components/ButtonCol';
import { FontStyles } from 'assets/theme/styles';

export enum MintStatus {
  Minting = 'Minting...',
  Minted = 'Minted',
  MintFailed = 'Mint Failed',
}

const mintTextObj = {
  [MintStatus.Minting]: 'Your NFT is being minted.',
  [MintStatus.Minted]: 'Your NFT has been successfully minted.',
  [MintStatus.MintFailed]: `Mint failure could be due to network issues. Pleaset try again.`,
};

interface MintStatusSectionProps {
  status: MintStatus;
}

const MintStatusSection = (props: MintStatusSectionProps) => {
  const { status } = props;

  const buttonList = useMemo<ButtonRowProps['buttons']>(() => {
    if (MintStatus.Minting === status)
      return [
        {
          title: 'Close',
          type: 'outline',
          onPress: () => {
            console.log('Close');
          },
        },
      ];

    if (MintStatus.Minted === status)
      return [
        {
          title: 'Set as Profile Photo',
          type: 'primary',
          onPress: () => {
            console.log('Set as Profile Photo');
          },
        },
        {
          title: 'View in Wallet',
          type: 'outline',
          onPress: () => {
            console.log('View in Wallet');
          },
        },
      ];
    if (MintStatus.MintFailed === status)
      return [
        {
          title: 'Try Again',
          type: 'primary',
          onPress: () => {
            console.log('try again');
          },
        },
      ];
  }, [status]);

  return (
    <>
      <View style={styles.topSection}>
        <View style={styles.nftWrap}>
          <NFTAvatar
            disabled
            nftSize={pTd(200)}
            data={{
              imageUrl:
                'https://hamster-mainnet.s3.ap-northeast-1.amazonaws.com/aa633483-b730-4e71-8ae4-1b523d48a409.png',
            }}
            style={styles.nftAvatar}
          />
          <View style={styles.nftStatusWrapIcon}>
            <StatusIcon status={status} />
          </View>
        </View>
        <View
          style={[
            GStyles.marginTop(pTd(44)),
            GStyles.paddingLeft(pTd(36)),
            GStyles.paddingRight(pTd(36)),
            GStyles.width100,
          ]}>
          <TextXXL style={GStyles.textAlignCenter}>{status}</TextXXL>
          <TextM style={[GStyles.textAlignCenter, GStyles.marginTop(pTd(4)), FontStyles.neutralTertiaryText]}>
            {mintTextObj[status]}
          </TextM>
        </View>
      </View>

      <View style={GStyles.flex1} />
      {status === MintStatus.MintFailed && (
        <TextM
          style={[
            FontStyles.neutralTertiaryText,
            GStyles.textAlignCenter,
            GStyles.paddingLeft(pTd(16)),
            GStyles.paddingRight(pTd(16)),
          ]}>
          You can safely close this window and view it later in NFTs.
        </TextM>
      )}
      <ButtonCol buttons={buttonList} />
    </>
  );
};

const styles = StyleSheet.create({
  topSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: pTd(20),
  },
  nftWrap: {
    position: 'relative',
    width: pTd(200),
    height: pTd(200),
    marginHorizontal: 'auto',
  },
  nftAvatar: {
    width: pTd(200),
    height: pTd(200),
    borderRadius: pTd(12),
    marginHorizontal: 'auto',
  },
  nftStatusIcon: {
    position: 'absolute',
    bottom: pTd(0),
    right: pTd(0),
    width: pTd(24),
    height: pTd(24),
    borderRadius: pTd(12),
    backgroundColor: defaultColors.primaryColor,
  },
  nftStatusWrapIcon: {
    position: 'absolute',
    bottom: pTd(-20),
    width: pTd(200),
    height: pTd(24),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MintStatusSection;
