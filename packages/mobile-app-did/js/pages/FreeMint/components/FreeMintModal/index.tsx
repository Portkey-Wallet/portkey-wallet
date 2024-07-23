import React, { useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import GStyles from 'assets/theme/GStyles';
import { IconName } from 'components/Svg';
import MintPreview from '../MintPreview';
import MintStatusSection, { MintStatus } from '../MintStatusSection';

enum FreeMintStep {
  mintNft = 'Mint NFT',
  preview = 'Preview',
  mintResult = '',
}

export type DisclaimerModalProps = {
  url: string;
  title: string;
  description: string;
  icon?: IconName;
};

export const FreeMintModal = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<FreeMintStep>(FreeMintStep.mintResult);

  return (
    <ModalBody modalBodyType="bottom" title={step} isShowLeftBackIcon={step === FreeMintStep.preview}>
      <View style={styles.contentWrap}>
        {step === FreeMintStep.mintNft && <MintPreview />}
        {step === FreeMintStep.preview && <MintPreview />}
        {step === FreeMintStep.mintResult && <MintStatusSection status={MintStatus.Minted} />}
      </View>
    </ModalBody>
  );
};

export const showFreeMintModal = () => {
  OverlayModal.show(<FreeMintModal />, {
    position: 'bottom',
    enabledNestScrollView: true,
  });
};

export default {
  showFreeMintModal,
};

const styles = StyleSheet.create({
  contentWrap: {
    paddingHorizontal: pTd(20),
    paddingTop: pTd(8),
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  favIcon: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    marginBottom: pTd(8),
    marginTop: pTd(24),
  },
  title: {
    marginBottom: pTd(2),
  },
  scrollView: {
    padding: pTd(12),
    backgroundColor: defaultColors.bg6,
    borderRadius: pTd(6),
    flex: 1,
  },
  contentText: {
    color: defaultColors.font3,
    marginBottom: pTd(8),
  },
  agreeWrap: {
    marginTop: pTd(26),
    marginBottom: pTd(20),
  },
  group: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    marginTop: pTd(8),
    borderRadius: pTd(6),
    ...GStyles.paddingArg(16, 16, 0),
  },
  walletTitle: {
    marginTop: pTd(24),
    paddingLeft: pTd(10),
  },
});
