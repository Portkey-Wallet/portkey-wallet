import React, { useCallback, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import GStyles from 'assets/theme/GStyles';
import { IconName } from 'components/Svg';
import MintPreview from '../MintPreview';
import MintStatusSection from '../MintStatusSection';
import MintEdit, { EditConfig } from 'pages/FreeMint/MintEdit';
import { useConfirmMint, useFreeMintInfo } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { ICollectionData, IConfirmMintRes } from '@portkey-wallet/types/types-ca/freeMint';

import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';

export enum FreeMintStep {
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

export const FreeMintModal = ({ itemId, freeMintStep }: { itemId?: string; freeMintStep?: FreeMintStep }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<FreeMintStep>(freeMintStep ? freeMintStep : FreeMintStep.mintNft);
  const fetchMintInfo = useFreeMintInfo();
  const [mintInfo, setMintInfo] = useState<ICollectionData | undefined>(undefined);
  const [editInfo, setEditInfo] = useState<EditConfig>();
  const [confirmMintResponse, setConfirmMintResponse] = useState<IConfirmMintRes | undefined>(undefined);

  const { confirm: confirmMint } = useConfirmMint();

  const changeStep = useCallback((_step: FreeMintStep) => setStep(_step), []);

  const onMintConfirm = useCallback(async () => {
    try {
      Loading.show();

      const res = await confirmMint({
        name: editInfo?.name || '',
        description: editInfo?.description || '',
        imageUrl: editInfo?.imageUri || '',
      });
      setConfirmMintResponse(res);
      changeStep?.(FreeMintStep.mintResult);
    } catch (error) {
      console.log('error', error);
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [changeStep, confirmMint, editInfo?.description, editInfo?.imageUri, editInfo?.name]);

  useEffectOnce(() => {
    (async () => {
      const res = await fetchMintInfo();
      setMintInfo(res);
    })();
  });

  return (
    <ModalBody
      preventBack
      modalBodyType="bottom"
      title={t(step)}
      onBack={() => changeStep(FreeMintStep.mintNft)}
      isShowLeftBackIcon={step === FreeMintStep.preview}>
      <View style={styles.contentWrap}>
        {step === FreeMintStep.mintNft && (
          <MintEdit
            itemId={itemId || ''}
            setStep={setStep}
            editInfo={editInfo}
            onEditCallback={(name, description, imageUrl) => {
              setEditInfo({
                name,
                description,
                imageUri: imageUrl,
              });
            }}
          />
        )}
        {step === FreeMintStep.preview && (
          <MintPreview mintInfo={mintInfo} editInfo={editInfo} onMintPress={onMintConfirm} />
        )}
        {step === FreeMintStep.mintResult && (
          <MintStatusSection
            changeStep={changeStep}
            editInfo={editInfo}
            mintInfo={mintInfo}
            confirmMintResponse={confirmMintResponse}
          />
        )}
      </View>
    </ModalBody>
  );
};

export const showFreeMintModal = (itemId?: string, freeMintStep?: FreeMintStep) => {
  OverlayModal.show(<FreeMintModal itemId={itemId} freeMintStep={freeMintStep} />, {
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
