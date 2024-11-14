import { defaultColors } from 'assets/theme';
import NFTAvatar from 'components/NFTAvatar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import StatusIcon from '../StatusIcon';
import { TextL, TextXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { ButtonRowProps } from 'components/ButtonCol';
import { FreeMintStep } from '../FreeMintModal';
import { useLoopMintNFTDetail, useLoopMintStatus } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import { FreeMintStatus, ICollectionData, IConfirmMintRes } from '@portkey-wallet/types/types-ca/freeMint';
import { EditConfig } from 'pages/FreeMint/components/MintEdit';
import { useSetUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';
import myEvents from 'utils/deviceEvent';
import fonts from 'assets/theme/fonts';
import { makeStyles } from '@rneui/themed';
import ButtonRow from 'components/ButtonRow';

export enum MintStatus {
  Minting = 'Minting...',
  Minted = 'Minted',
  MintFailed = 'Mint NFT Failed',
}

const mintTextObj = {
  [MintStatus.Minting]: 'Your NFT is being minted. You can close this window and view it later in your NFT gallery.',
  [MintStatus.Minted]: 'Your NFT has been successfully minted.',
  [MintStatus.MintFailed]: `There was an issue minting your NFT. Would you like to try again?`,
};

interface MintStatusSectionProps {
  itemId?: string;
  editInfo?: EditConfig;
  mintInfo?: ICollectionData;
  confirmMintResponse?: IConfirmMintRes;
  mintStatusType?: MintStatus;
  changeStep?: (step: FreeMintStep) => void;
}

const MintStatusSection = (props: MintStatusSectionProps) => {
  const { itemId, editInfo, mintInfo, confirmMintResponse, mintStatusType, changeStep } = props;
  const styles = getStyles();
  const setUserInfo = useSetUserInfo();
  const loopFetchNFTItemDetail = useLoopMintNFTDetail();
  const [btnLoading, setBtnLoading] = useState(false);

  const getMintStatus = useLoopMintStatus();
  const [status, setStatus] = useState<MintStatus>(mintStatusType ?? MintStatus.Minting);

  useEffect(() => {
    (async () => {
      const result = await getMintStatus(confirmMintResponse?.itemId || itemId || '');
      if (result === FreeMintStatus.FAIL) {
        myEvents.updateMintStatus.emit();
        setStatus(MintStatus.MintFailed);
      }
      if (result === FreeMintStatus.SUCCESS) {
        myEvents.updateMintStatus.emit();
        // setStatus(MintStatus.Minted);
        fetchNftItemInfo();
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
      navigationService.navigate('Tab');
      navigationService.navigate('NFTDetail', {
        ...nftDetail,
        collectionInfo: {
          imageUrl: mintInfo.collectionInfo.imageUrl,
          collectionName: mintInfo.collectionInfo.collectionName,
          symbol: mintInfo.collectionInfo.symbol,
          chainId: mintInfo.collectionInfo.chainId,
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
    mintInfo?.collectionInfo.symbol,
  ]);

  const setAvatar = useCallback(async () => {
    try {
      Loading.show();
      await setUserInfo({
        avatar: editInfo?.imageUri || '',
      });
      CommonToast.success('Profile photo is set.');
      navigationService.navigate('Tab');
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
            navigationService.navigate('Tab');
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
          title: 'Cancel',
          type: 'outline',
          onPress: () => {
            navigationService.navigate('Tab');
          },
        },
        {
          title: 'Retry',
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
        {/* <TextL
          style={[
            GStyles.marginTop(pTd(32)),
            GStyles.width100,
            GStyles.textAlignCenter,
            styles.mediumText,
          ]}>{`${confirmMintResponse?.name} #${confirmMintResponse?.tokenId}`}</TextL> */}
        <View style={styles.nftWrap}>
          <NFTAvatar
            disabled
            nftSize={pTd(280)}
            data={{
              imageUrl: editInfo?.imageUri || '',
            }}
            style={styles.nftAvatar}
          />
        </View>
        <View style={styles.nftStatusWrapIcon}>
          <StatusIcon status={status} />
        </View>
        <View
          style={[
            GStyles.marginTop(pTd(44)),
            GStyles.paddingLeft(pTd(36)),
            GStyles.paddingRight(pTd(36)),
            GStyles.width100,
          ]}>
          <TextXXL style={[GStyles.textAlignCenter, fonts.BGMediumFont]}>{status}</TextXXL>
          <TextL style={[GStyles.textAlignCenter, GStyles.marginTop(pTd(4)), styles.sgRegular]}>
            {mintTextObj[status]}
          </TextL>
        </View>
      </View>

      <View style={GStyles.flex1} />
      <ButtonRow buttons={buttonList} />
    </>
  );
};
const getStyles = makeStyles(theme => ({
  topSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  nftWrap: {
    position: 'relative',
    marginTop: pTd(8),
    width: pTd(280),
    height: pTd(280),
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  nftAvatar: {
    width: pTd(280),
    height: pTd(280),
    borderRadius: pTd(16),
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: pTd(48),
  },
  mediumText: {
    ...fonts.mediumFont,
  },
  sgRegular: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase2,
  },
}));

export default MintStatusSection;
