import React, { useState, useCallback, useEffect, useRef, SetStateAction, Dispatch, useMemo } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import FormItem from 'components/FormItem';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { ScrollView } from 'react-native';
import Touchable from 'components/Touchable';
import deleteImage from 'assets/image/pngs/deleteImage.png';
import ImageWithUploadFunc, { ImageShowType, ImageWithUploadFuncInstance } from 'components/ImageWithUploadFuncV2';
import { FreeMintStep } from '../components/FreeMintModal';
import { useGetMintItemInfo } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type EditConfig = {
  imageUri: string;
  name: string;
  description: string;
};
const MintEdit = (props: {
  itemId: string;
  editInfo?: EditConfig;
  setStep: Dispatch<SetStateAction<FreeMintStep>>;
  onEditCallback: (name: string, description: string, imageUrl: string) => void;
}) => {
  const { itemId, setStep, editInfo, onEditCallback } = props;
  const [value, setValue] = useState<EditConfig>({
    imageUri: '',
    name: '',
    description: '',
  });
  const [canNext, setNext] = useState<boolean>(false);
  const uploadRef = useRef<ImageWithUploadFuncInstance>(null);
  const [showDeleteIcon, setShowDeleteIcon] = useState<boolean>(false);
  const getMintItemInfo = useGetMintItemInfo();
  const hasUploadImage = useMemo(() => !!editInfo?.imageUri, [editInfo?.imageUri]);

  useEffect(() => {
    if (editInfo) {
      setValue(prev => ({
        ...prev,
        name: editInfo.name,
        description: editInfo.description,
        imageUri: editInfo.imageUri,
      }));
      return;
    }
    if (!itemId) {
      return;
    }
    (async () => {
      const res = await getMintItemInfo(itemId);
      setValue(prev => ({ ...prev, name: res.name, description: res.description, imageUri: res.imageUrl }));
    })();
  }, [editInfo, getMintItemInfo, itemId]);
  const onChooseSuccess = useCallback((result: { uri: any }) => {
    setValue(prev => ({ ...prev, imageUri: result.uri || '' }));
  }, []);

  const onChangeNameText = useCallback((valueName: string) => {
    setValue(prev => ({ ...prev, name: valueName }));
  }, []);
  const onChangeDescriptionText = useCallback((valueDescription: string) => {
    setValue(prev => ({ ...prev, description: valueDescription }));
  }, []);
  const onNext = useCallback(async () => {
    if (!value.imageUri) return;

    // todo wfs onNext
    let s3Url = value.imageUri || '';
    if (!hasUploadImage) {
      try {
        Loading.show();
        s3Url = (await uploadRef.current?.uploadPhoto()) || '';
      } catch (error) {
        console.log(error);
        CommonToast.failError(error);
      } finally {
        Loading.hide();
      }
    }

    onEditCallback(value.name, value.description, s3Url);
    setStep && setStep(FreeMintStep.preview);
  }, [hasUploadImage, onEditCallback, setStep, value.description, value.imageUri, value.name]);

  useEffect(() => {
    if (value.imageUri && value.name) {
      setNext(true);
    } else {
      setNext(false);
    }
  }, [value.imageUri, value.name]);
  useEffect(() => {
    if (value.imageUri) {
      setShowDeleteIcon(true);
    } else {
      setShowDeleteIcon(false);
    }
  }, [setShowDeleteIcon, value.imageUri]);
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}>
      {/* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}> */}
      <View style={styles.uploadContainer}>
        {/* <Touchable style={GStyles.center} onPress={() => uploadRef.current?.selectPhoto()}> */}
        {showDeleteIcon && (
          <Touchable
            style={styles.deleteIconStyle}
            activeOpacity={1}
            onPress={() => {
              uploadRef.current?.clear();
            }}>
            <Image resizeMode="contain" source={deleteImage} style={{ width: pTd(28), height: pTd(28) }} />
          </Touchable>
        )}
        <View style={{ marginTop: pTd(8) }}>
          <ImageWithUploadFunc
            avatarSize={pTd(280)}
            ref={uploadRef}
            title={''}
            type={ImageShowType.NORMAL}
            imageUrl={value.imageUri}
            defaultComponent={
              <View style={styles.uploadBox}>
                <Svg icon="suggest-add" size={pTd(48)} />
                <Text style={styles.uploadText}>
                  Upload a picture{'\n'}Formats supported: JPG, JPEG and PNG. {'\n'}Max size: 10 MB.
                </Text>
              </View>
            }
            onChooseSuccess={onChooseSuccess}
          />
        </View>
        {/* </Touchable> */}
        <FormItem title="Name" style={styles.formItemContainer}>
          <CommonInput
            type="general"
            value={value.name}
            placeholder={'Give your NFT a unique name'}
            maxLength={30}
            inputContainerStyle={styles.inputWrap}
            onChangeText={onChangeNameText}
            containerStyle={styles.contentWrap}
          />
        </FormItem>

        <FormItem title="Description (Optional)" style={styles.formItemContainer}>
          <CommonInput
            type="general"
            value={value.description}
            placeholder={'Tell people more about your NFT'}
            maxLength={1000}
            multiline
            inputContainerStyle={[styles.inputWrap, styles.contentDescriptionWrap]}
            inputStyle={styles.descriptionInput}
            onChangeText={onChangeDescriptionText}
            containerStyle={styles.contentDescriptionWrap}
          />
        </FormItem>
        <CommonButton
          disabled={!canNext}
          type="primary"
          title={'Next'}
          containerStyle={styles.btnStyle}
          onPress={onNext}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};
// const MintEditWrapper = () => {
//   const gStyles = useGStyles();
//   const { t } = useLanguage();
//   return (
//     <ModalBody modalBodyType="bottom" title={t('Mint NFT')} style={gStyles.overlayStyle}>
//       <MintEdit setStep={undefined} onEditCallback={undefined} />
//     </ModalBody>
//   );
// };

// export const showMintEdit = (params?: ShowAssetListParamsType) => {
//   OverlayModal.show(<MintEditWrapper {...params} />, {
//     position: 'bottom',
//     autoKeyboardInsets: false,
//     enabledNestScrollView: true,
//   });
// };

export default MintEdit;

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    paddingBottom: pTd(50),
    backgroundColor: 'white',
    borderTopLeftRadius: pTd(8),
    borderTopRightRadius: pTd(8),
    flexDirection: 'column',
  },
  deleteIconStyle: {
    position: 'absolute',
    right: pTd(18),
    top: 0,
    zIndex: 999,
  },
  formItemContainer: {
    width: '100%',
    marginTop: pTd(24),
  },
  btnStyle: {
    marginTop: pTd(24),
    width: '100%',
  },
  uploadContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: pTd(24),
  },
  uploadBox: {
    width: pTd(280),
    height: pTd(280),
    padding: pTd(24),
    backgroundColor: defaultColors.neutralHoverBG,
    borderRadius: pTd(12),
    borderStyle: 'dashed',
    borderWidth: pTd(1),
    borderColor: defaultColors.neutralBorder,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    textAlign: 'center',
    color: defaultColors.neutralDisableText,
    fontSize: pTd(14),
    marginTop: pTd(16),
    fontWeight: '400',
    lineHeight: pTd(22),
  },
  inputWrap: {
    backgroundColor: defaultColors.bg1,
    borderColor: defaultColors.neutralBorder,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: pTd(52),
  },
  descriptionInput: {
    height: pTd(120),
    textAlignVertical: 'top',
  },
  contentWrap: {
    height: pTd(52),
  },
  contentDescriptionWrap: {
    height: pTd(120),
  },
});
