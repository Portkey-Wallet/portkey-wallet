import { useConfirmMint, useFreeMintInfo, useGetMintItemInfo } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import { ICollectionData, IConfirmMintRes } from '@portkey-wallet/types/types-ca/freeMint';
import Svg, { IconName } from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useState } from 'react';
import MintEdit, { EditConfig } from '../components/MintEdit';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import myEvents from 'utils/deviceEvent';
import { useEffectOnce } from '@portkey-wallet/hooks';
import PageContainer from 'components/PageContainer';
import { View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import MintPreview from '../components/MintPreview';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import MintStatusSection, { MintStatus } from '../components/MintStatusSection';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';

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
const MintProcess = () => {
  const { t } = useLanguage();
  const styles = getStyles();
  const { itemId, freeMintStep, mintStatusType } = useRouterParams<{
    itemId?: string;
    freeMintStep?: FreeMintStep;
    mintStatusType?: MintStatus;
  }>();
  const [step, setStep] = useState<FreeMintStep>(freeMintStep !== undefined ? freeMintStep : FreeMintStep.mintNft);
  // const [step, setStep] = useState<FreeMintStep>(freeMintStep !== undefined ? freeMintStep : FreeMintStep.mintResult);
  const fetchMintInfo = useFreeMintInfo();
  const [mintInfo, setMintInfo] = useState<ICollectionData | undefined>(undefined);
  const [editInfo, setEditInfo] = useState<EditConfig>();
  const [confirmMintResponse, setConfirmMintResponse] = useState<IConfirmMintRes | undefined>(undefined);
  const getMintItemInfo = useGetMintItemInfo();
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
      myEvents.updateMintStatus.emit();
      Loading.hide();
    }
  }, [changeStep, confirmMint, editInfo?.description, editInfo?.imageUri, editInfo?.name]);

  useEffectOnce(() => {
    (async () => {
      const res = await fetchMintInfo();
      setMintInfo(res);
    })();
  });

  useEffectOnce(() => {
    (async () => {
      if (!itemId) return;
      const res = await getMintItemInfo(itemId);
      setEditInfo({
        ...res,
        imageUri: res.imageUrl || '',
      });
      setConfirmMintResponse(res);
    })();
  });
  return (
    <PageContainer
      noCenterDom
      leftCallback={() => {
        if (step === FreeMintStep.preview) {
          setStep(FreeMintStep.mintNft);
        } else {
          navigationService.goBack();
        }
      }}
      leftDom={
        step === FreeMintStep.mintResult ? (
          <Touchable
            style={GStyles.marginLeft(16)}
            onPress={() => {
              navigationService.navigate('Tab');
            }}>
            <Svg icon="close4" size={pTd(20)} />
          </Touchable>
        ) : null
      }
      safeAreaColor={['white', 'black']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{ disabled: true }}>
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
        <View style={styles.contentWrap}>
          <MintPreview mintInfo={mintInfo} editInfo={editInfo} onMintPress={onMintConfirm} />
        </View>
      )}
      {step === FreeMintStep.mintResult && (
        <View style={styles.contentWrap}>
          <MintStatusSection
            itemId={itemId}
            editInfo={editInfo}
            mintInfo={mintInfo}
            changeStep={changeStep}
            confirmMintResponse={confirmMintResponse}
            mintStatusType={mintStatusType}
          />
        </View>
      )}
    </PageContainer>
  );
};
const getStyles = makeStyles(theme => ({
  pageStyles: {
    backgroundColor: theme.colors.bgBase1,
    flex: 1,
    paddingBottom: pTd(24),
    paddingHorizontal: 0,
    flexDirection: 'column',
    height: '100%',
  },
  contentWrap: {
    paddingHorizontal: pTd(16),
    paddingTop: pTd(8),
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));
export default MintProcess;
