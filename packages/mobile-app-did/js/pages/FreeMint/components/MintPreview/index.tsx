import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ICollectionData } from '@portkey-wallet/types/types-ca/freeMint';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import ButtonRow from 'components/ButtonRow';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextM, TextS } from 'components/CommonText';
import NFTAvatar from 'components/NFTAvatar';
import OverlayModal from 'components/OverlayModal';
import { useLanguage } from 'i18n/hooks';
import { EditConfig } from 'pages/FreeMint/MintEdit';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { FreeMintStep } from '../FreeMintModal';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';

interface MintPreviewProps {
  mintInfo?: ICollectionData;
  editInfo?: EditConfig;
  onCancelPress?: () => void;
  onMintPress?: () => void;
  changeStep?: (step: FreeMintStep) => void;
}

const MintPreview = (props: MintPreviewProps) => {
  const { t } = useLanguage();
  const { currentNetwork } = useWallet();
  const defaultToken = useDefaultToken();
  const { mintInfo, editInfo, onCancelPress, onMintPress } = props;

  return (
    <>
      <View style={[styles.topSection, !editInfo?.description && GStyles.itemCenter]}>
        <NFTAvatar disabled nftSize={pTd(64)} data={{ imageUrl: editInfo?.imageUri || '' }} style={styles.nftAvatar} />
        <View style={styles.nftInfo}>
          <TextL numberOfLines={1} ellipsizeMode="middle">
            {editInfo?.name}
          </TextL>
          {editInfo?.description && <View style={GStyles.height(pTd(4))} />}
          {editInfo?.description && <TextS style={FontStyles.neutralTertiaryText}>{editInfo?.description}</TextS>}
        </View>
      </View>
      <View style={GStyles.marginTop(pTd(24))}>
        <View style={[GStyles.flexRow, styles.rowWrap]}>
          <TextM style={[styles.leftTitle, FontStyles.neutralTertiaryText, GStyles.flex(2)]}>{t('Chain')}</TextM>
          <View style={styles.blank} />
          <TextM style={[styles.rightValue, styles.rightValue, FontStyles.font5, GStyles.flex(3)]}>
            {formatChainInfoToShow(mintInfo?.collectionInfo.chainId, currentNetwork)}
          </TextM>
        </View>

        <View style={[GStyles.flexRow, styles.rowWrap, GStyles.itemCenter, GStyles.marginTop(pTd(16))]}>
          <TextM style={[styles.leftTitle, FontStyles.neutralTertiaryText]}>{t('Collection')}</TextM>
          <View style={styles.blank} />
          <View style={[GStyles.flexRow, GStyles.center]}>
            <CommonAvatar imageUrl={mintInfo?.collectionInfo?.imageUrl} style={styles.nftCollectionAvatar} />
            <TextM style={[styles.rightValue, FontStyles.neutralPrimaryTextColor, GStyles.marginLeft(pTd(4))]}>
              {mintInfo?.collectionInfo?.collectionName}
            </TextM>
          </View>
        </View>

        <View style={[GStyles.flexRow, styles.rowWrap, GStyles.marginTop(16)]}>
          <TextM style={[styles.leftTitle, FontStyles.neutralTertiaryText, GStyles.flex(2)]}>
            {t('Transaction Fee')}
          </TextM>
          <View style={styles.blank} />
          <View>
            <TextM style={styles.rightValue}>{`${mintInfo?.transactionFee} ${defaultToken.symbol}`}</TextM>
            <TextS style={[FontStyles.neutralTertiaryText, styles.rightValue]}>{`$ 0`}</TextS>
          </View>
        </View>
      </View>
      <View style={GStyles.flex1} />
      <ButtonRow
        buttons={[
          {
            title: 'Cancel',
            type: 'outline',
            onPress: () => {
              onCancelPress?.();
              OverlayModal.hide();
            },
          },
          {
            title: 'Mint',
            type: 'primary',
            onPress: () => {
              onMintPress?.();
            },
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  topSection: {
    padding: pTd(12),
    borderRadius: pTd(6),
    borderColor: defaultColors.neutralBorder,
    borderWidth: StyleSheet.hairlineWidth,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nftAvatar: {
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    marginRight: pTd(12),
  },
  nftInfo: {
    width: pTd(243),
  },
  rowWrap: { marginBottom: pTd(12) },
  leftTitle: {},
  blank: { width: pTd(16), flex: 1 },
  rightValue: {
    textAlign: 'right',
  },
  verticalBlank: {
    height: pTd(4),
  },
  nftCollectionAvatar: {
    borderRadius: pTd(4),
    width: pTd(20),
    height: pTd(20),
  },
});

export default MintPreview;
