import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ICollectionData } from '@portkey-wallet/types/types-ca/freeMint';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import ButtonRow from 'components/ButtonRow';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextM, TextXXL } from 'components/CommonText';
import NFTAvatar from 'components/NFTAvatar';
import { useLanguage } from 'i18n/hooks';
import { EditConfig } from 'pages/FreeMint/components/MintEdit';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { pTd } from 'utils/unit';
import { FreeMintStep } from '../FreeMintModal';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import fonts from 'assets/theme/fonts';
import { makeStyles } from '@rneui/themed';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';

interface MintPreviewProps {
  mintInfo?: ICollectionData;
  editInfo?: EditConfig;
  onMintPress?: () => void;
  changeStep?: (step: FreeMintStep) => void;
}

const MintPreview = (props: MintPreviewProps) => {
  const { t } = useLanguage();
  const styles = getStyles();
  const { currentNetwork } = useWallet();
  const defaultToken = useDefaultToken();
  const { mintInfo, editInfo, onMintPress } = props;
  const isMainnet = useIsMainnet();

  return (
    <ScrollView nestedScrollEnabled>
      <View style={[styles.topSection, !editInfo?.description && GStyles.itemCenter]}>
        <NFTAvatar disabled nftSize={pTd(280)} data={{ imageUrl: editInfo?.imageUri || '' }} style={styles.nftAvatar} />
        <View style={styles.nftInfo}>
          <TextXXL numberOfLines={1} ellipsizeMode="tail" style={[fonts.BGMediumFont, styles.textCenter]}>
            {editInfo?.name}
          </TextXXL>
          {editInfo?.description && <View style={GStyles.height(pTd(4))} />}
          {editInfo?.description && (
            <TextL style={[fonts.SGRegularFont, styles.textCenter, styles.description]}>{editInfo?.description}</TextL>
          )}
        </View>
      </View>
      <View style={GStyles.marginTop(pTd(32))}>
        <View style={[GStyles.flexRow, styles.rowWrap]}>
          <TextL style={[styles.leftTitle, FontStyles.fontBase1, GStyles.flex(2)]}>{t('Network')}</TextL>
          <View style={styles.blank} />
          <CommonAvatar
            hasBorder={true}
            avatarSize={pTd(20)}
            imageUrl={mintInfo?.collectionInfo.chainImageUrl}
            borderStyle={styles.tokenIconBorder}
          />
          <TextL
            style={[
              styles.rightValue,
              styles.rightValue,
              FontStyles.fontBase1,
              fonts.SGMediumFont,
              GStyles.marginLeft(4),
            ]}>
            {formatChainInfoToShow(mintInfo?.collectionInfo.chainId, currentNetwork)}
          </TextL>
        </View>

        <View style={[GStyles.flexRow, styles.rowWrap, GStyles.itemCenter]}>
          <TextL style={[styles.leftTitle, FontStyles.fontBase1]}>{t('Collection')}</TextL>
          <View style={styles.blank} />
          <View style={[GStyles.flexRow, GStyles.center]}>
            <CommonAvatar imageUrl={mintInfo?.collectionInfo?.imageUrl} style={styles.nftCollectionAvatar} />
            <TextL style={[styles.rightValue, FontStyles.fontBase1, GStyles.marginLeft(pTd(4)), fonts.SGMediumFont]}>
              {mintInfo?.collectionInfo?.collectionName}
            </TextL>
          </View>
        </View>

        <View style={[GStyles.flexRow, styles.rowWrap]}>
          <TextL style={[styles.leftTitle, FontStyles.fontBase1, GStyles.flex(2)]}>{t('Transaction Fee')}</TextL>
          <View style={styles.blank} />
          <View>
            <TextL
              style={[
                styles.rightValue,
                fonts.SGMediumFont,
              ]}>{`${mintInfo?.transactionFee} ${defaultToken.symbol}`}</TextL>
            {isMainnet && <TextM style={[FontStyles.neutralTertiaryText, styles.feeSub]}>{'$ 0'}</TextM>}
          </View>
        </View>
      </View>
      <View style={GStyles.height(84)} />
      <ButtonRow
        buttons={[
          // {
          //   title: 'Cancel',
          //   type: 'outline',
          //   onPress: () => {
          //     onCancelPress?.();
          //     OverlayModal.hide();
          //   },
          // },
          {
            title: 'Mint',
            type: 'primary',
            onPress: () => {
              onMintPress?.();
            },
          },
        ]}
      />
    </ScrollView>
  );
};

const getStyles = makeStyles(theme => ({
  topSection: {
    // padding: pTd(12),
    // borderRadius: pTd(6),
    // borderColor: defaultColors.neutralBorder,
    // borderWidth: StyleSheet.hairlineWidth,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  nftAvatar: {
    // width: pTd(64),
    // height: pTd(64),
    borderRadius: pTd(6),
    marginRight: pTd(12),
  },
  nftInfo: {
    marginTop: pTd(16),
  },
  rowWrap: { paddingVertical: pTd(16) },
  leftTitle: {},
  blank: { width: pTd(16), flex: 1 },
  rightValue: {
    textAlign: 'right',
  },
  verticalBlank: {
    height: pTd(4),
  },
  nftCollectionAvatar: {
    borderRadius: pTd(9),
    width: pTd(18),
    height: pTd(18),
  },
  feeSub: {
    color: theme.colors.textBase2,
    ...fonts.SGRegularFont,
    textAlign: 'right',
  },
  textCenter: {
    textAlign: 'center',
  },
  tokenIconBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
  },
  description: {
    color: theme.colors.textBase2,
  },
}));

export default MintPreview;
