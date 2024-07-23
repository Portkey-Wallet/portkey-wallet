import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import ButtonRow from 'components/ButtonRow';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextM, TextS } from 'components/CommonText';
import NFTAvatar from 'components/NFTAvatar';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

interface MintPreviewProps {
  onCancelPress?: () => void;
  onMintPress?: () => void;
}

const MintPreview = (props: MintPreviewProps) => {
  const { t } = useLanguage();
  const { onCancelPress, onMintPress } = props;

  return (
    <>
      <View style={styles.topSection}>
        <NFTAvatar disabled nftSize={pTd(64)} data={{ imageUrl: '' }} style={styles.nftAvatar} />
        <View style={styles.nftInfo}>
          <TextL numberOfLines={1} ellipsizeMode="middle">
            AAABBB #123
          </TextL>
          <View style={GStyles.height(pTd(4))} />
          <TextS numberOfLines={2} ellipsizeMode="middle" style={FontStyles.neutralTertiaryText}>
            kitty meowmeowmoew lovely cat lovely cat, meowmeowmoew lovely cat lovely.
          </TextS>
        </View>
      </View>
      <View style={GStyles.marginTop(pTd(24))}>
        <View style={[GStyles.flexRow, styles.rowWrap]}>
          <TextM style={[styles.leftTitle, FontStyles.font3, GStyles.flex(2)]}>{t('Chain')}</TextM>
          <View style={styles.blank} />
          <TextM style={[styles.rightValue, styles.rightValue, FontStyles.font5, GStyles.flex(3)]}>
            MianChain AELF
          </TextM>
        </View>

        <View style={[GStyles.flexRow, styles.rowWrap, GStyles.itemCenter, GStyles.marginTop(pTd(16))]}>
          <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Collection')}</TextM>
          <View style={styles.blank} />
          <View style={[GStyles.flexRow, GStyles.center]}>
            <CommonAvatar
              imageUrl={
                'https://hamster-mainnet.s3.ap-northeast-1.amazonaws.com/aa633483-b730-4e71-8ae4-1b523d48a409.png'
              }
              style={styles.nftCollectionAvatar}
            />
            <TextM style={[styles.rightValue, FontStyles.neutralPrimaryTextColor, GStyles.marginLeft(pTd(4))]}>
              Portkey Free Mint
            </TextM>
          </View>
        </View>

        <View style={[GStyles.flexRow, styles.rowWrap, GStyles.marginTop(16)]}>
          <TextM style={[styles.leftTitle, FontStyles.font3, GStyles.flex(2)]}>{t('Transaction Fee')}</TextM>
          <View style={styles.blank} />
          <View>
            <TextM style={styles.rightValue}>{`0`}</TextM>
            <TextS style={[FontStyles.neutralPrimaryTextColor, styles.rightValue]}>{`$ 0`}</TextS>
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
    alignItems: 'center',
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
