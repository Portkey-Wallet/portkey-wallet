import { defaultColors } from 'assets/theme';
import NFTAvatar from 'components/NFTAvatar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import StatusIcon from '../StatusIcon';
import { TextL, TextM, TextXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import ButtonCol, { ButtonRowProps } from 'components/ButtonCol';
import { FontStyles } from 'assets/theme/styles';
import { FreeMintStep } from '../FreeMintModal';
import { useLoopMintNFTDetail, useLoopMintStatus } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import { FreeMintStatus, ICollectionData, IConfirmMintRes } from '@portkey-wallet/types/types-ca/freeMint';
import { EditConfig } from 'pages/FreeMint/MintEdit';
import { useSetUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import OverlayModal from 'components/OverlayModal';
import navigationService from 'utils/navigationService';
import myEvents from 'utils/deviceEvent';
import fonts from 'assets/theme/fonts';

export enum MintStatus {
  Minting = 'Minting...',
  Minted = 'Minted',
  MintFailed = 'Mint Failed',
}

const mintTextObj = {
  [MintStatus.Minting]: 'Your NFT is being minted.',
  [MintStatus.Minted]: 'Your NFT has been successfully minted.',
  [MintStatus.MintFailed]: `Mint failure could be due to network issues. Please try again.`,
};

interface MintStatusSectionProps {
  itemId?: string;
  editInfo?: EditConfig;
  mintInfo?: ICollectionData;
  confirmMintResponse?: IConfirmMintRes;
  changeStep?: (step: FreeMintStep) => void;
}

const MintStatusSection = (props: MintStatusSectionProps) => {
  const { itemId, editInfo, mintInfo, confirmMintResponse, changeStep } = props;
  const setUserInfo = useSetUserInfo();
  const loopFetchNFTItemDetail = useLoopMintNFTDetail();
  const [btnLoading, setBtnLoading] = useState(false);

  const getMintStatus = useLoopMintStatus();
  const [status, setStatus] = useState<MintStatus>(MintStatus.Minting);

  useEffect(() => {
    (async () => {
      const result = await getMintStatus(confirmMintResponse?.itemId || itemId || '');
      if (result === FreeMintStatus.FAIL) {
        myEvents.updateMintStatus.emit();
        setStatus(MintStatus.MintFailed);
      }
      if (result === FreeMintStatus.SUCCESS) {
        myEvents.updateMintStatus.emit();
        setStatus(MintStatus.Minted);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNftItemInfo = useCallback(async () => {
    if (!confirmMintResponse?.symbol || !mintInfo?.collectionInfo.chainId) return;

    try {
      setBtnLoading(true);

      const nftDetail = await loopFetchNFTItemDetail({
        symbol: confirmMintResponse?.symbol,
        chainId: mintInfo?.collectionInfo.chainId ?? 'AELF',
      });

      OverlayModal.hide();
      navigationService.navigate('NFTDetail', {
        ...nftDetail,
        collectionInfo: {
          imageUrl: mintInfo.collectionInfo.imageUrl,
          collectionName: mintInfo.collectionInfo.collectionName,
        },
      });
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      setBtnLoading(false);
    }
  }, [
    confirmMintResponse?.symbol,
    loopFetchNFTItemDetail,
    mintInfo?.collectionInfo.chainId,
    mintInfo?.collectionInfo.collectionName,
    mintInfo?.collectionInfo.imageUrl,
  ]);

  const setAvatar = useCallback(async () => {
    try {
      Loading.show();
      await setUserInfo({
        avatar: editInfo?.imageUri || '',
      });
      CommonToast.success('Profile photo is set.');
      OverlayModal.hide();
    } catch (error) {
      CommonToast.fail('Failed to set profile photo. Please try again.');
      console.log('error', error);
    } finally {
      Loading.hide();
    }
  }, [editInfo?.imageUri, setUserInfo]);

  const buttonList = useMemo<ButtonRowProps['buttons']>(() => {
    if (MintStatus.Minting === status)
      return [
        {
          title: 'Close',
          type: 'outline',
          onPress: () => {
            OverlayModal.hide();
          },
        },
      ];

    if (MintStatus.Minted === status)
      return [
        {
          title: 'Set as Profile Photo',
          type: 'primary',
          onPress: setAvatar,
        },
        {
          loading: btnLoading,
          title: 'View in Wallet',
          type: 'outline',
          onPress: () => {
            fetchNftItemInfo();
          },
        },
      ];

    if (MintStatus.MintFailed === status)
      return [
        {
          title: 'Try Again',
          type: 'primary',
          onPress: () => {
            changeStep?.(FreeMintStep.mintNft);
          },
        },
      ];
  }, [btnLoading, changeStep, fetchNftItemInfo, setAvatar, status]);

  return (
    <>
      <View style={styles.topSection}>
        <TextL
          style={[
            GStyles.marginTop(pTd(32)),
            GStyles.width100,
            GStyles.textAlignCenter,
            styles.mediumText,
          ]}>{`${confirmMintResponse?.name} #${confirmMintResponse?.tokenId}`}</TextL>
        <View style={styles.nftWrap}>
          <NFTAvatar
            disabled
            nftSize={pTd(200)}
            data={{
              imageUrl: editInfo?.imageUri || '',
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
          <TextXXL style={[GStyles.textAlignCenter, styles.mediumText]}>{status}</TextXXL>
          <TextM style={[GStyles.textAlignCenter, GStyles.marginTop(pTd(4)), FontStyles.neutralTertiaryText]}>
            {mintTextObj[status]}
          </TextM>
        </View>
      </View>

      <View style={GStyles.flex1} />
      {status === MintStatus.Minting && (
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
  },
  nftWrap: {
    position: 'relative',
    marginTop: pTd(12),
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
    bottom: -pTd(20),
    width: pTd(200),
    height: pTd(40),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediumText: {
    ...fonts.mediumFont,
  },
});

export default MintStatusSection;
